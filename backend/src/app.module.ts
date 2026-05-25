import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User }     from './users/entities/user.entity';
import { Project }  from './projects/entities/project.entity';
import { Task }     from './tasks/entities/task.entity';
import { Hito }     from './hitos/entities/hito.entity';
import { Material } from './hitos/entities/material.entity';
import { AuthModule }     from './auth/auth.module';
import { UsersModule }    from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule }    from './tasks/tasks.module';
import { HitosModule }    from './hitos/hitos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.get('DB_HOST',     'localhost'),
        port:     config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER',     'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME',     'gestorproyectos'),
        entities:    [User, Project, Task, Hito, Material],
        synchronize: true, // solo para desarrollo — usar migraciones en producción
      }),
    }),

    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    HitosModule,
  ],
})
export class AppModule {}
