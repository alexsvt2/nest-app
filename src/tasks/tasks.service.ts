import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { v4 as uuidv4 } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
	constructor(private taskRepository: TaskRepository) { }

	// private tasks: Task[] = [];
	// getAllTasks(): Task[] {
	// 	return this.tasks;
	// }

	async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
		return this.taskRepository.getTasks(filterDto);
	}


	// getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
	// 	const { status, search } = filterDto;
	// 	let tasks = this.getAllTasks();
	// 	if (status) {
	// 		tasks = tasks.filter((task) => task.status === status);
	// 	}
	// 	if (search) {
	// 		tasks = tasks.filter((task) => task.title.includes(search) || task.description.includes(search));
	// 	}
	// 	return tasks;
	// }
	// 	this.tasks.push(task);
	// 	return task;
	// }


	async getTaskById(id: number): Promise<Task> {
		const found = await this.taskRepository.findOne(id);

		if (!found) {
			throw new NotFoundException(`Task with id "${id}" not found`);
		}

		console.log(found);
		return found;
	}

	async updateTaskStatusById(id: number, status: TaskStatus) {
		const task = await this.getTaskById(id);
		task.status = status;
		await task.save();
	}

	async createTask(
		createTaskDto: CreateTaskDto,
		user: User,
		): Promise<Task> {
		return this.taskRepository.createTask(createTaskDto, user);
	}

	async deleteTaskById(id: number): Promise<void> {
		const result = await this.taskRepository.delete(id);

		if (result.affected === 0) {
			throw new NotFoundException(`Task with id ${id} was not found`);
		}
	}
}
