import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskType, TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

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
