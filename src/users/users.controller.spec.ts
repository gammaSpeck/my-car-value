import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      async findOne(id: number) {
        return { id, email: 'md@md.com', password: 'pwd' } as User;
      },
      async find(email: string) {
        return [{ id: 1, email, password: 'pwd' } as User];
      },
      // async remove() {},
      // async update() {},
    };
    fakeAuthService = {
      async signIn(email: string, password: string) {
        return { id: 1, email, password } as User;
      },
      // async signUp() {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('md@md.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('md@md.com');
  });

  it('findUser returns a single user with an id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error when given id not found', async () => {
    fakeUsersService.findOne = async (id: number) => null;
    try {
      await controller.findUser('1');
    } catch (err) {
      expect(err?.message).toBe('user not found');
    }
  });

  it('signIn updates session and returns user', async () => {
    const session = { userId: null };

    const user = await controller.signIn(
      { email: 'md@md.com', password: 'pwd' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
