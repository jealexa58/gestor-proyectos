import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { HitoStatus } from '../entities/hito.entity';

export class CreateHitoDto {
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(HitoStatus)
  @IsOptional()
  status?: HitoStatus;
}
