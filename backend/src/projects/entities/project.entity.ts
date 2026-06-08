import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Hito } from '../../hitos/entities/hito.entity';
import { Material } from '../../hitos/entities/material.entity';

export enum Sector {
  SOFTWARE = 'SOFTWARE',
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

  @Column('numeric', { precision: 15, scale: 2 })
  budget: number;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'enum', enum: Sector })
  sector: Sector;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => Hito, (hito) => hito.project)
  hitos: Hito[];

  @OneToMany(() => Material, (material) => material.project)
  materiales: Material[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}