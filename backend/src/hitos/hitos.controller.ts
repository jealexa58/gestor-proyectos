import {
  Controller, Get, Post, Patch,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { HitosService } from './hitos.service';
import { CreateHitoDto } from './dto/create-hito.dto';
import { UpdateHitoProgressDto } from './dto/update-hito.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller()
export class HitosController {
  constructor(private readonly hitosService: HitosService) {}

  @Get('projects/:projectId/hitos')
  findHitos(@Param('projectId') projectId: string, @CurrentUser() user: User) {
    return this.hitosService.findHitosByProject(projectId, user.id);
  }

  @Get('projects/:projectId/materiales')
  findMateriales(@Param('projectId') projectId: string, @CurrentUser() user: User) {
    return this.hitosService.findMaterialesByProject(projectId, user.id);
  }

  @Post('projects/:projectId/hitos')
  createHito(
    @Param('projectId') projectId: string,
    @Body() dto: CreateHitoDto,
    @CurrentUser() user: User,
  ) {
    return this.hitosService.createHito(projectId, dto, user.id);
  }

  @Patch('hitos/:id')
  updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdateHitoProgressDto,
    @CurrentUser() user: User,
  ) {
    return this.hitosService.updateProgress(id, dto, user.id);
  }
}
