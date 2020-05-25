import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';

@Controller('tasks')
export class TasksController {
	constructor(private tasksService: TasksService) {}

	@Get()
	getAllTasks() {
		return this.tasksService.getAllTasks();
	}

	@Post()
	createTask(@Body() createTaskDto: CreateTaskDto) {
		return this.tasksService.createTask(createTaskDto);
	}

	@Patch('/:id/status')
	updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus) {
		return this.tasksService.updateTaskStatusById(id, status);
	}

	@Get('/:id')
	getTaskById(@Param('id') id: string) {
		return this.tasksService.getTaskById(id);
	}

	@Delete('/:id')
	deleteTaskById(@Param('id') id: string) {
		return this.tasksService.deleteTaskById(id);
	}
}
