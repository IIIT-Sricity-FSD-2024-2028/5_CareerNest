import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCollegeAdminDto {
  @ApiProperty({ example: 'Dr. Ganesh Kumar' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ganesh@iiitsricity.ac.in' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '123' })
  @IsOptional()
  @IsString()
  password?: string;
}
