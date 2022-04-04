import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuhService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      async find(email: string) {
        return users.filter((u) => u.email === email);
      },
      async create(email: string, password: string) {
        const user = {
          id: Math.floor(Math.random() * 9999999),
          email,
          password,
        } as User;
        users.push(user);
        return user;
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(authService).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await authService.signUp('md@md.com', 'password');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with an email already in use', async () => {
    const params = { email: 'md@md.com', password: 'password' };
    await authService.signUp(params.email, params.password);

    try {
      await authService.signUp(params.email, params.password);
    } catch (err) {
      expect(err?.message).toBe('user already exists');
    }
  });

  it('Throws error if signin is called with unused email', async () => {
    try {
      await authService.signIn('md@md.com', 'password');
    } catch (err) {
      expect(err?.message).toBe('user email not found');
    }
  });

  it('Throws error if invalid password is provided', async () => {
    const params = { email: 'md@md.com', password: 'password' };
    await authService.signUp(params.email, params.password);

    try {
      await authService.signIn(params.email, 'wrong password');
    } catch (err) {
      expect(err?.message).toBe('password does not match');
    }
  });

  it('Returns a user when a correct password is provided', async () => {
    const params = { email: 'md@md.com', password: 'password' };

    await authService.signUp(params.email, params.password);
    const user = await authService.signIn(params.email, params.password);

    expect(user).toBeDefined();
  });
});
