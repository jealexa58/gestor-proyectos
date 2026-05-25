import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskType, TaskStatus, TaskPriority } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
