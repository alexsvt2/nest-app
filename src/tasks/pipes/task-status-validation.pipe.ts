import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { TaskStatus } from './../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
	readonly allowedStatus = [
		TaskStatus.DONE,
		TaskStatus.IN_PROGRESS,
		TaskStatus.OPEN
	];

	// Metada is optional
	transform(value: any) {
		value = value.toUpperCase();
		// console.log('value', value);
		if (!this.isStatusValid(value)) {
			throw new BadRequestException(`"${value}" is an invalid status`);
		}
		return value;
	}

	private isStatusValid(status: any) {
		const idx = this.allowedStatus.indexOf(status);
		return idx !== -1;
	}


}
