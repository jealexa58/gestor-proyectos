import {
  Controller, Get, Post, Patch,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HitosService } from './hitos.service';
import { CreateHitoDto } from './dto/create-hito.dto';
import { UpdateHitoProgressDto } from './dto/update-hito.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Hitos & Materiales (Construccion)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class HitosController {
  constructor(private readonly hitosService: HitosService) {}

  @Get('projects/:projectId/hitos')
  @ApiOperation({ summary: 'Listar hitos de un proyecto de Construccion' })
  @ApiResponse({ status: 200, description: 'Lista de hitos.' })
  findHitos(@Param('projectId') projectId: string, @CurrentUser() user: User) {
    return this.hitosService.findHitosByProject(projectId, user.id);
  }

  @Get('projects/:projectId/materiales')
  @ApiOperation({ summary: 'Listar materiales y planos de un proyecto de Construccion' })
  @ApiResponse({ status: 200, description: 'Lista de materiales y planos.' })
  findMateriales(@Param('projectId') projectId: string, @CurrentUser() user: User) {
    return this.hitosService.findMaterialesByProject(projectId, user.id);
  }

  @Post('projects/:projectId/hitos')
  @ApiOperation({ summary: 'Crear un hito en un proyecto de Construccion' })
  @ApiResponse({ status: 201, description: 'Hito creado.' })
  createHito(
    @Param('projectId') projectId: string,
    @Body() dto: CreateHitoDto,
    @CurrentUser() user: User,
  ) {
    return this.hitosService.createHito(projectId, dto, user.id);
  }

  @Patch('hitos/:id')
  @ApiOperation({ summary: 'Actualizar el porcentaje de avance de un hito' })
  @ApiResponse({ status: 200, description: 'Hito actualizado.' })
  updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdateHitoProgressDto,
    @CurrentUser() user: User,
  ) {
    return this.hitosService.updateProgress(id, dto, user.id);
  }
}
