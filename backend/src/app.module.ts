import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { HitosModule } from './hitos/hitos.module';

@Module({
  imports: [
    // Configuración global para variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configuración asíncrona de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // Railway usa esto principalmente
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'gestorproyectos'),
        autoLoadEntities: true, // Carga automáticamente las entidades (User, Project, Task, etc.)
        synchronize: true, // Sincroniza las entidades con la base de datos (¡Solo para desarrollo!)
      }),
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    HitosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}