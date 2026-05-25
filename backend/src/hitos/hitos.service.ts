import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hito, HitoStatus } from './entities/hito.entity';
import { Material } from './entities/material.entity';
import { ProjectsService } from '../projects/projects.service';
import { CreateHitoDto } from './dto/create-hito.dto';
import { UpdateHitoProgressDto } from './dto/update-hito.dto';

@Injectable()
export class HitosService {
  constructor(
    @InjectRepository(Hito)
    private readonly hitoRepo: Repository<Hito>,
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
    private readonly projectsService: ProjectsService,
  ) {}

  async findHitosByProject(projectId: string, userId: string): Promise<Hito[]> {
    await this.projectsService.findOne(projectId, userId);
    return this.hitoRepo.find({ where: { projectId }, order: { startDate: 'ASC' } });
  }

  async findMaterialesByProject(projectId: string, userId: string): Promise<Material[]> {
    await this.projectsService.findOne(projectId, userId);
    return this.materialRepo.find({ where: { projectId }, order: { id: 'ASC' } });
  }

  async createHito(projectId: string, dto: CreateHitoDto, userId: string): Promise<Hito> {
    await this.projectsService.findOne(projectId, userId);
    const hito = this.hitoRepo.create({ ...dto, projectId, progress: 0 });
    return this.hitoRepo.save(hito);
  }

  async updateProgress(hitoId: string, dto: UpdateHitoProgressDto, userId: string): Promise<Hito> {
    const hito = await this.hitoRepo.findOne({ where: { id: hitoId } });
    if (!hito) throw new NotFoundException('Hito no encontrado');
    await this.projectsService.findOne(hito.projectId, userId);

    hito.progress = dto.progress;
    hito.status   = dto.progress === 100
      ? HitoStatus.COMPLETADO
      : dto.progress > 0
        ? HitoStatus.EN_CURSO
        : HitoStatus.PENDIENTE;

    return this.hitoRepo.save(hito);
  }
}
