import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User }    from '../../users/entities/user.entity';
import { Task }    from '../../tasks/entities/task.entity';
import { Hito }    from '../../hitos/entities/hito.entity';
import { Material } from '../../hitos/entities/material.entity';

export enum Sector {
  SOFTWARE     = 'SOFTWARE',
  CONSTRUCCION = 'CONSTRUCCION',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  client: string;

  @Column('decimal', { precision: 15, scale: 2 })
  budget: number;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'enum', enum: Sector })
  sector: Sector;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Task, (task) => task.project, { cascade: true })
  tasks: Task[];

  @OneToMany(() => Hito, (hito) => hito.project, { cascade: true })
  hitos: Hito[];

  @OneToMany(() => Material, (material) => material.project, { cascade: true })
  materiales: Material[];
}
