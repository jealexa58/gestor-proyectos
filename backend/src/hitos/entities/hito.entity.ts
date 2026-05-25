import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum HitoStatus {
  PENDIENTE  = 'PENDIENTE',
  EN_CURSO   = 'EN_CURSO',
  COMPLETADO = 'COMPLETADO',
}

@Entity('hitos')
export class Hito {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: HitoStatus, default: HitoStatus.PENDIENTE })
  status: HitoStatus;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, (project) => project.hitos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
