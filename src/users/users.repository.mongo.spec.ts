import { Test, TestingModule } from '@nestjs/testing';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { ObjectId } from 'mongodb';
import { UsersRepository } from './users.repository.mongo';
import { MongoDBModule } from '../db/database.mongo.module';
import { UserDao } from './dao/user.dao';

describe('UsersRepository', () => {
  let service: UsersRepository;
  const testUser: UserDao = {
    _id: new ObjectId(),
    firstName: 'firstName',
    lastName: 'lastName',
    userName: 'userName',
    email: 'email',
    created: new Date(),
    lastUpdated: new Date(),
    isActive: true,
  };
  const mockCollection = {
    findOne: jest.fn(() => of(testUser)),
    insertOne: jest.fn(() => of({ insertedCount: 1, ops: [testUser] })),
    updateOne: jest.fn(() => of({ modifiedCount: 1 })),
    deleteOne: jest.fn(() => of({ deletedCount: 1 })),
  };
  const dbMock = {
    collection: () => mockCollection,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UsersRepository, Logger, ConfigService],
      imports: [MongoDBModule],
    })
      .overrideProvider('MONGODB_CONNECTION')
      .useFactory({
        factory: async (): Promise<object> => dbMock,
      })
      .compile();

    service = app.get<UsersRepository>(UsersRepository);
  });

  describe('findOne', () => {
    it('should return existing user', async () => {
      const found = await service.findOne(testUser._id).toPromise();
      expect(found).toEqual(testUser);
    });
  });

  describe('create', () => {
    it('should return created user', async () => {
      const created = await service.create(testUser).toPromise();
      expect(created).toEqual(testUser);
    });
  });

  describe('update', () => {
    it('should return 1 as updated count', async () => {
      const updatedCount = await service.update(testUser).toPromise();
      expect(updatedCount).toEqual(1);
    });
  });

  describe('delete', () => {
    it('should return 1 as deleted count', async () => {
      const deletedCount = await service.delete(testUser._id).toPromise();
      expect(deletedCount).toEqual(1);
    });
  });
});
