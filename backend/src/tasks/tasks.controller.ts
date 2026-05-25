import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Tasks (Software)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('projects/:projectId/tasks')
  @ApiOperation({ summary: 'Listar tareas de un proyecto Software' })
  @ApiResponse({ status: 200, description: 'Lista de tareas.' })
  findByProject(@Param('projectId') projectId: string, @CurrentUser() user: User) {
    return this.tasksService.findByProject(projectId, user.id);
  }

  @Post('projects/:projectId/tasks')
  @ApiOperation({ summary: 'Crear una tarea en un proyecto Software' })
  @ApiResponse({ status: 201, description: 'Tarea creada.' })
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.create(projectId, dto, user.id);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Actualizar estado o campos de una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.update(id, dto, user.id);
  }

  @Delete('tasks/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiResponse({ status: 204, description: 'Tarea eliminada.' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(id, user.id);
  }
}
