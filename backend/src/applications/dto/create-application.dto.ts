import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsIn, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ example: 1, description: 'Opportunity ID to apply for' })
  @IsNumber()
  opportunityId: number;

  @ApiPropertyOptional({ example: 1, description: 'Candidate user ID' })
  @IsOptional()
  @IsNumber()
  candidateId?: number;

  @ApiPropertyOptional({ example: 'Shameer Basha Shaik' })
  @IsOptional()
  @IsString()
  candidateName?: string;

  @ApiPropertyOptional({ example: 'Computer Science' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ example: 8.7 })
  @IsOptional()
  @IsNumber()
  cgpa?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  hasReferral?: boolean;
}
