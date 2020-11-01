import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService, private log: Logger) {
    this.log.setContext(UsersController.name);
  }

  @Get('/:id')
  @HttpCode(200)
  findUser(@Param('id') id: string): Observable<User> {
    return this.users.findUser(id);
  }

  @Post()
  @HttpCode(201)
  createUser(
    @Body(
      new ValidationPipe({
        groups: ['create'],
      }),
    )
    user: User,
  ): Observable<User> {
    return this.users.createUser(user);
  }

  @Put()
  @HttpCode(200)
  updateUser(
    @Body(
      new ValidationPipe({
        groups: ['update'],
      }),
    )
    user: User,
  ): Observable<number> {
    return this.users.updateUser(user);
  }

  @Delete('/:id')
  @HttpCode(200)
  deleteUser(@Param('id') id: string): Observable<number> {
    return this.users.deleteUser(id);
  }
}
