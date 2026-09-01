import { IsIn, IsOptional, IsString, IsDateString, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateApplicationDto {
  @ApiPropertyOptional({
    example: 'Interview',
    enum: ['Applied', 'Shortlisted', 'Assessment', 'Interview', 'Offered', 'Rejected', 'Withdrawn'],
  })
  @IsOptional()
  @IsIn(['Applied', 'Shortlisted', 'Assessment', 'Interview', 'Offered', 'Rejected', 'Withdrawn'])
  status?: string;

  @ApiPropertyOptional({ example: '2026-03-15' })
  @IsOptional()
  @IsDateString()
  interviewDate?: string;

  @ApiPropertyOptional({ example: 'Strong technical background' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({
    example: { resume: 'Pass', assessment: 'Pass', technical: 'Scheduled', hr: 'Scheduled' },
    description: 'Round-by-round results updated by the recruiter',
  })
  @IsOptional()
  @IsObject()
  rounds?: {
    resume?: string;
    assessment?: string;
    technical?: string;
    hr?: string;
  };
}
