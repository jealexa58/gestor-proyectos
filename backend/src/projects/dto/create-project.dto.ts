import { IsEnum, IsNotEmpty, IsNumber, IsString, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sector } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'Portal E-Commerce V2' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del proyecto es requerido' })
  name: string;

  @ApiProperty({ example: 'RetailCorp S.A.' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
  client: string;

  @ApiProperty({ example: 48000000, description: 'Presupuesto en moneda local' })
  @IsNumber()
  @Min(0, { message: 'El presupuesto no puede ser negativo' })
  budget: number;

  @ApiProperty({ example: '2024-12-31', description: 'Fecha de cierre estimada' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (YYYY-MM-DD)' })
  endDate: string;

  @ApiProperty({ enum: Sector, example: Sector.SOFTWARE })
  @IsEnum(Sector, { message: 'El sector debe ser SOFTWARE o CONSTRUCCION' })
  sector: Sector;
}