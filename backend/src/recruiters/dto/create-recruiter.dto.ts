import { IsString, IsEmail, IsOptional, IsIn, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecruiterDto {
  @ApiProperty({ example: 'Priya Kapoor' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'TechCorp Solutions' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'HR Manager' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'priya.kapoor@techcorp.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+91 98765 43210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Mumbai, Maharashtra' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'Experienced HR professional with 8+ years in talent acquisition.' })
  @IsOptional()
  @IsString()
  bio?: string;
}
