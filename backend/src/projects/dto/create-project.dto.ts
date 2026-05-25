import { IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sector } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'Portal E-Commerce V2' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'RetailCorp S.A.' })
  @IsString()
  client: string;

  @ApiProperty({ example: 48000000 })
  @IsNumber()
  budget: number;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ enum: Sector, example: Sector.SOFTWARE })
  @IsEnum(Sector)
  sector: Sector;
}
