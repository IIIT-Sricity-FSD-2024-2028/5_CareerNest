import {
  Controller, Get, Post, Put, Delete, Param,
  Body, ParseIntPipe, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiSecurity, ApiResponse } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Assessments')
@ApiSecurity('x-role')
@UseGuards(RolesGuard)
@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly service: AssessmentsService) {}

  @Get()
  @Roles('recruiter', 'placement_officer')
  @ApiOperation({ summary: 'Get all assessments (recruiter / placement_officer)' })
  @ApiResponse({ status: 200, description: 'List of assessments' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('recruiter', 'placement_officer')
  @ApiOperation({ summary: 'Get a single assessment by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('recruiter')
  @ApiOperation({ summary: 'Create a new assessment (recruiter only)' })
  @ApiBody({ type: CreateAssessmentDto })
  @ApiResponse({ status: 201, description: 'Assessment created' })
  create(@Body() dto: CreateAssessmentDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('recruiter')
  @ApiOperation({ summary: 'Update an assessment (recruiter only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAssessmentDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssessmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('recruiter')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an assessment (recruiter only)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
