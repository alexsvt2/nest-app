import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from 'src/auth/auth.module';

import { MulterModule } from '@nestjs/platform-express';

@Module({
	imports: [
		TypeOrmModule.forFeature([ TaskRepository ]),
		MulterModule.register({
			dest: './images'
		}),
		AuthModule
	],
	controllers: [ TasksController ],
	providers: [ TasksService ]
})
export class TasksModule {}
