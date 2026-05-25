import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HitoStatus } from '../entities/hito.entity';

export class CreateHitoDto {
  @ApiProperty({ example: 'Cimentación y estructura' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2025-03-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-07-15' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ enum: HitoStatus, default: HitoStatus.PENDIENTE })
  @IsEnum(HitoStatus)
  @IsOptional()
  status?: HitoStatus;
}
