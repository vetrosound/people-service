import { ObjectId } from 'mongodb';

export class UserDao {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  created: Date;
  lastUpdated: Date;
  isActive: boolean;
}
