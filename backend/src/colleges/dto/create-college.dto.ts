import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCollegeDto {
  @ApiProperty({ example: 'IIIT Sri City' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'IIITSRICITY' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'admin@iiitsricity.ac.in' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+91 8626 252525' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Chittoor, Andhra Pradesh' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'https://iiits.ac.in' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive', 'suspended'] })
  @IsOptional()
  @IsIn(['active', 'inactive', 'suspended'])
  status?: 'active' | 'inactive' | 'suspended';
}
