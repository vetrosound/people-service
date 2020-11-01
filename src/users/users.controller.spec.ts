import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { of } from 'rxjs';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const name = 'John';
  const userDto: User = {
    id: new ObjectId().toHexString(),
    firstName: 'firstName',
    lastName: 'lastName',
    userName: 'userName',
    email: 'email',
    created: new Date(),
    lastUpdated: new Date(),
    isActive: true,
  };
  const usersServiceMock = {
    findUser: jest.fn(() => of(userDto)),
    createUser: jest.fn(() => of(userDto)),
    updateUser: jest.fn(() => of(1)),
    deleteUser: jest.fn(() => of(1)),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, Logger],
    })
      .overrideProvider(UsersService)
      .useValue(usersServiceMock)
      .compile();

    controller = app.get<UsersController>(UsersController);
  });

  describe('findUser', () => {
    it('should return user', async () => {
      const found = await controller.findUser(userDto.id).toPromise();
      expect(found).toEqual(userDto);
    });
  });

  describe('createUser', () => {
    it('should return user', async () => {
      const created = await controller.createUser(userDto).toPromise();
      expect(created).toEqual(userDto);
    });
  });

  describe('updateUser', () => {
    it('should return 1 as count', async () => {
      const count = await controller.updateUser(userDto).toPromise();
      expect(count).toEqual(1);
    });
  });

  describe('deleteUser', () => {
    it('should return 1 as count', async () => {
      const count = await controller.deleteUser(userDto.id).toPromise();
      expect(count).toEqual(1);
    });
  });
});
