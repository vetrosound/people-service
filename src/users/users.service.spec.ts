import { Test, TestingModule } from '@nestjs/testing';

import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { of } from 'rxjs';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository.mongo';
import { UserDao } from './dao/user.dao';
import { User } from './dto/user.dto';

describe('UsersService', () => {
  let service: UsersService;
  const userDao: UserDao = {
    _id: new ObjectId(),
    firstName: 'firstName',
    lastName: 'lastName',
    userName: 'userName',
    email: 'email',
    created: new Date(),
    lastUpdated: new Date(),
    isActive: true,
  };
  const userDto: User = {
    id: userDao._id.toHexString(),
    firstName: userDao.firstName,
    lastName: userDao.lastName,
    userName: userDao.userName,
    email: userDao.email,
    created: userDao.created,
    lastUpdated: userDao.lastUpdated,
    isActive: userDao.isActive,
  };
  const usersRepoMock = {
    findOne: jest.fn(() => of(userDao)),
    create: jest.fn(() => of(userDao)),
    update: jest.fn(() => of(1)),
    delete: jest.fn(() => of(1)),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UsersService, Logger, UsersRepository],
    })
      .overrideProvider(UsersRepository)
      .useValue(usersRepoMock)
      .compile();

    service = app.get<UsersService>(UsersService);
  });

  describe('findUser', () => {
    it('should return user dto', async () => {
      const found = await service.findUser(userDto.id).toPromise();
      expect(found).toEqual(userDto);
    });
  });

  describe('createUser', () => {
    it('should return user dto', async () => {
      const created = await service.createUser(userDto).toPromise();
      expect(created).toEqual(userDto);
    });
  });

  describe('updateUser', () => {
    it('should return 1 as updated user count', async () => {
      const count = await service.updateUser(userDto).toPromise();
      expect(count).toEqual(1);
    });
  });

  describe('deleteUser', () => {
    it('should return 1 as deleted user count', async () => {
      const count = await service.deleteUser(userDto.id).toPromise();
      expect(count).toEqual(1);
    });
  });
});
