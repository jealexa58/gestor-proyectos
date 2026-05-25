import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hito } from './entities/hito.entity';
import { Material } from './entities/material.entity';
import { HitosService } from './hitos.service';
import { HitosController } from './hitos.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hito, Material]), ProjectsModule],
  providers: [HitosService],
  controllers: [HitosController],
})
export class HitosModule {}
