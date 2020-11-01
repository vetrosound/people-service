import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObjectId } from 'mongodb';
import { User } from './dto/user.dto';
import { UserDao } from './dao/user.dao';
import { UsersRepository } from './users.repository.mongo';

@Injectable()
export class UsersService {
  constructor(private log: Logger, private usersRepository: UsersRepository) {
    this.log.setContext(UsersService.name);
  }

  findUser(id: string): Observable<User> {
    this.log.debug(`Getting hello for id: ${id}`);
    this.validateId(id);
    return this.usersRepository
      .findOne(new ObjectId(id))
      .pipe(map(result => this.daoToDto(result)));
  }

  createUser(user: User): Observable<User> {
    this.log.debug(`Creating user: ${JSON.stringify(user)}`);
    const toCreate = this.dtoToDao(user);
    return this.usersRepository
      .create(toCreate)
      .pipe(map(result => this.daoToDto(result)));
  }

  updateUser(user: User): Observable<number> {
    this.log.debug(`Updating user: ${JSON.stringify(user)}`);
    this.validateId(user.id);
    const toUpdate = this.dtoToDao(user);
    return this.usersRepository.update(toUpdate);
  }

  deleteUser(id: string): Observable<number> {
    this.log.debug(`Deleting user with id: ${id}`);
    this.validateId(id);
    return this.usersRepository.delete(new ObjectId(id));
  }

  private daoToDto(entity: UserDao): User {
    return {
      id: entity._id.toHexString(),
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      userName: entity.userName,
      created: entity.created,
      lastUpdated: entity.lastUpdated,
      isActive: entity.isActive,
    };
  }

  private dtoToDao(user: User): UserDao {
    return {
      _id: new ObjectId(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      created: user.created,
      lastUpdated: user.lastUpdated,
      isActive: user.isActive,
    };
  }

  private validateId(id: string | number | ObjectId): void {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }
  }
}
