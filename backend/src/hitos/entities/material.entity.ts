import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum MaterialType {
  MATERIAL = 'MATERIAL',
  PLANO    = 'PLANO',
}

export enum MaterialStatus {
  SOLICITADO = 'SOLICITADO',
  EN_CAMINO  = 'EN_CAMINO',
  RECIBIDO   = 'RECIBIDO',
}

@Entity('materiales')
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: MaterialType })
  type: MaterialType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantity: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ type: 'enum', enum: MaterialStatus, default: MaterialStatus.SOLICITADO })
  status: MaterialStatus;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, (project) => project.materiales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
