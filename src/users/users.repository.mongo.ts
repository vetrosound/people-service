import {
  Injectable,
  Inject,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { omit, omitBy } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDao } from './dao/user.dao';

@Injectable()
export class UsersRepository {
  private collectionName: string;

  constructor(
    @Inject('MONGODB_CONNECTION') private db: Db,
    private log: Logger,
    private config: ConfigService,
  ) {
    this.log.setContext(UsersRepository.name);
    this.collectionName = this.config.get<string>('DB_COLLECTION');
  }

  findOne(_id: ObjectId): Observable<UserDao> {
    return from(this.db.collection(this.collectionName).findOne({ _id })).pipe(
      map(result => {
        if (!result) {
          throw new NotFoundException(`User with id ${_id} not found.`);
        }
        return result;
      }),
    );
  }

  create(user: UserDao): Observable<UserDao> {
    const now = new Date();
    user._id = new ObjectId();
    user.created = now;
    user.lastUpdated = now;
    user.isActive = true;
    return from(this.db.collection(this.collectionName).insertOne(user)).pipe(
      map(result => {
        const { insertedCount, ops } = result;
        if (insertedCount < 1) {
          throw new InternalServerErrorException('Failed to create user.');
        }
        return ops[0];
      }),
    );
  }

  update(withUpdates: UserDao): Observable<number> {
    const _id = withUpdates._id;
    withUpdates.lastUpdated = new Date();
    const filteredEntity = omitBy(
      omit(withUpdates, 'created', '_id'),
      prop => prop === undefined,
    );
    return from(
      this.db
        .collection(this.collectionName)
        .updateOne({ _id }, { $set: filteredEntity }),
    ).pipe(
      map(result => {
        if (result.modifiedCount < 1) {
          throw new NotFoundException(`User with id ${_id} not found.`);
        }
        return result.modifiedCount;
      }),
    );
  }

  delete(_id: ObjectId): Observable<number> {
    return from(
      this.db.collection(this.collectionName).deleteOne({ _id }),
    ).pipe(map(result => result.deletedCount));
  }
}
