import { IsEmail, IsNotEmpty } from 'class-validator';

export class User {
  id: string;

  @IsNotEmpty({ groups: ['create'] })
  firstName: string;

  @IsNotEmpty({ groups: ['create'] })
  lastName: string;

  @IsEmail({}, { groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  email: string;

  @IsNotEmpty({ groups: ['create'] })
  userName: string;

  created: Date;

  lastUpdated: Date;

  isActive: boolean;
}
