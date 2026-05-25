import { IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { Sector } from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  client: string;

  @IsNumber()
  budget: number;

  @IsDateString()
  endDate: string;

  @IsEnum(Sector)
  sector: Sector;
}
