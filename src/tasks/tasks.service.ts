import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { v4 as uuidv4 } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TasksService {
	constructor(private taskRepository: TaskRepository) {}

	async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
		return this.taskRepository.getTasks(filterDto, user);
	}

	async getTaskById(id: number, user: User): Promise<Task> {
		const found = await this.taskRepository.findOne({
			where: { id, userId: user.id }
		});

		if (!found) {
			throw new NotFoundException(`Task with id "${id}" not found`);
		}
		return found;
	}

	async updateTaskStatusById(id: number, status: TaskStatus, user: User) {
		const task = await this.getTaskById(id, user);
		task.status = status;
		await task.save();
	}

	async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
		return this.taskRepository.createTask(createTaskDto, user);
	}

	async deleteTaskById(id: number, user: User): Promise<void> {
		const result = await this.taskRepository.delete({ id, userId: user.id });

		if (result.affected === 0) {
			throw new NotFoundException(`Task with id ${id} was not found`);
		}
	}

	async setTaskImage(id: number, image: string, imageUrl: string) {


		const oldImageName = (await this.taskRepository.findOne(id)).image;
		console.log(oldImageName);
		if(oldImageName){
			fs.unlinkSync(`./images/${oldImageName}`);
		}

		this.taskRepository.update(id, { image: image, imagePath: imageUrl });
	}
}
