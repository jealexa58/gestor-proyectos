import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum TaskStatus {
  BACKLOG     = 'BACKLOG',
  TODO        = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE        = 'DONE',
}

export enum TaskType {
  FEATURE = 'FEATURE',
  BUG     = 'BUG',
  TASK    = 'TASK',
}

export enum TaskPriority {
  LOW    = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH   = 'HIGH',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: TaskType, default: TaskType.TASK })
  type: TaskType;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.BACKLOG })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
