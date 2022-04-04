import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handles a signup request', async () => {
    const emailToTest = 'asda1qwe23s@asdas.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: emailToTest, password: 'pwd' })
      .expect(201);

    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(emailToTest);
  });

  it('Signup as a new user and get currently logged in user', async () => {
    const email = 'md@md.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'pwd' })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
