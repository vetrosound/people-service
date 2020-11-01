import { Module, Logger } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository.mongo';
import { MongoDBModule } from '../db/database.mongo.module';

@Module({
  imports: [MongoDBModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, Logger],
})
export class UsersModule {}
