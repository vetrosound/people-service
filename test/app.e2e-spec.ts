import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ObjectId, Db, MongoClient } from 'mongodb';
import * as request from 'supertest';

import { RootModule } from './../src/root.module';
import { User } from '../src/users/dto/user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: MongoClient;
  const user: User = {
    id: new ObjectId().toHexString(),
    firstName: 'firstName',
    lastName: 'lastName',
    userName: 'userName',
    email: 'email@test.com',
    created: new Date(),
    lastUpdated: new Date(),
    isActive: true,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RootModule],
    })
      .overrideProvider('MONGODB_CONNECTION')
      .useFactory({
        factory: async (): Promise<Db> => {
          client = await MongoClient.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            auth: {
              user: process.env.MONGO_USER,
              password: process.env.MONGO_PASSWORD,
            },
            authMechanism: 'DEFAULT',
          });
          return client.db('db');
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await client.close();
    await app.close();
  });

  it('should create, find, update, and delete users', async done => {
    const server = app.getHttpServer();
    const updatedName = 'new-name';
    const updatedEmail = 'new-email@test.com';

    // create a user
    let result = await request(server)
      .post('/users')
      .send(user);
    expect(result.status).toBe(201);
    expect(result.body).toBeDefined();
    const created: User = result.body;
    expect(created.id).toBeTruthy();
    expect(created.firstName).toBe(user.firstName);
    expect(created.lastName).toBe(user.lastName);
    expect(created.userName).toBe(user.userName);
    expect(created.email).toBe(user.email);
    expect(created.created).toBeTruthy();
    expect(created.lastUpdated).toBeTruthy();
    expect(created.isActive).toBe(true);

    // lookup the user
    result = await request(server).get(`/users/${created.id}`);
    expect(result.status).toBe(200);
    expect(result.body).toEqual(created);

    // update the user
    result = await request(server)
      .put('/users')
      .send({
        id: created.id,
        userName: updatedName,
        email: updatedEmail,
        isActive: false,
      });
    expect(result.status).toBe(200);
    expect(result.text).toBe('1');

    // verify user was updated
    result = await request(server).get(`/users/${created.id}`);
    expect(result.status).toBe(200);
    expect(result.body.userName).toBe(updatedName);
    expect(result.body.email).toBe(updatedEmail);
    expect(result.body.isActive).toBe(false);

    // delete the user
    result = await request(server).delete(`/users/${created.id}`);
    expect(result.status).toBe(200);
    expect(result.text).toEqual('1');

    // verify user was deleted
    result = await request(server).get(`/users/${created.id}`);
    expect(result.status).toBe(404);

    done();
  });
});
