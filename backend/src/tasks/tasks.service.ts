import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
    private readonly projectsService: ProjectsService,
  ) {}

  async findByProject(projectId: string, userId: string): Promise<Task[]> {
    await this.projectsService.findOne(projectId, userId);
    return this.repo.find({ where: { projectId }, order: { id: 'ASC' } });
  }

  async create(projectId: string, dto: CreateTaskDto, userId: string): Promise<Task> {
    await this.projectsService.findOne(projectId, userId);
    const task = this.repo.create({ ...dto, projectId });
    return this.repo.save(task);
  }

  async update(taskId: string, dto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.repo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    await this.projectsService.findOne(task.projectId, userId);
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async remove(taskId: string, userId: string): Promise<void> {
    const task = await this.repo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    await this.projectsService.findOne(task.projectId, userId);
    await this.repo.remove(task);
  }
}
