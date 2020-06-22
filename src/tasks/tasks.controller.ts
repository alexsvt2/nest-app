import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	Query,
	UsePipes,
	ValidationPipe,
	ParseIntPipe,
	UseGuards,
	Logger
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	SERVER_URL: string = 'http://localhost:3000/';

	private logger = new Logger('TasksController');
	constructor(private tasksService: TasksService) {}

	@Get()
	getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
		this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
		return this.tasksService.getTasks(filterDto, user);
	}

	@Get('/:id')
	getTaskById(
		@Param('id', ParseIntPipe)
		id: number,
		@GetUser() user: User
	): Promise<Task> {
		return this.tasksService.getTaskById(id, user);
	}

	@Post()
	@UsePipes(ValidationPipe)
	async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
		this.logger.verbose(`User "${user.username}" creating a new Task. Data: ${JSON.stringify(createTaskDto)}`);
		return this.tasksService.createTask(createTaskDto, user);
	}

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id', ParseIntPipe)
		id: number,
		@Body('status', TaskStatusValidationPipe)
		status: TaskStatus,
		@GetUser() user: User
	): Promise<void> {
		return this.tasksService.updateTaskStatusById(id, status, user);
	}

	@Delete('/:id')
	deleteTaskById(
		@Param('id', ParseIntPipe)
		id: number,
		@GetUser() user: User
	): Promise<void> {
		return this.tasksService.deleteTaskById(id, user);
	}

	// @Post('/:id/upload')
	// @UseInterceptors(FileInterceptor('image'))
	// async uploadTaskImage(@UploadedFile() image) {
	// 	const response = {
	// 		originalname: image.original,
	// 		filename: image.filename
	// 	};
	// 	return response;
	// }

	// @Post('/:id/upload')
	// @UseInterceptors(FileInterceptor('image',
	// {
	// 	storage: diskStorage({
	// 	destination: './images',
	// 	filename: (req, file, cb) => {
	// 		const randomName = Array(32).fill(null).map(() => (Math.round() * 16)).toString(16))
	// 	}
	// 	})
	// }
	// ))

	@Post(':id/image')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './images',
				filename: (req, file, callback) => {
					const randomName = Array(32)
						.fill(null)
						.map(() => Math.round(Math.random() * 16).toString(16))
						.join('');
					return callback(null, `${randomName}${extname(file.originalname)}`);
					// https://stackoverflow.com/questions/49096068/upload-file-using-nestjs-and-multer
				}
			})
		})
	)
	uploadTaskImage(
		@Param('id', ParseIntPipe)
		id: number,
		@UploadedFile() file
	) {
		console.log(file);
		// this.tasksService.setTaskImage(id, `${this.SERVER_URL}${file.path}`);
		this.tasksService.setTaskImage(id, file.filename, `${this.SERVER_URL}${file.path}`);
	}
}
