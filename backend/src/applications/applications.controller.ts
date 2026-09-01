import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  ParseIntPipe, UseGuards, Headers, HttpCode, HttpStatus, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiSecurity, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Applications')
@ApiSecurity('x-role')
@UseGuards(RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @Get()
  @Roles('recruiter', 'placement_officer')
  @ApiOperation({ summary: 'Get all applications (recruiter / placement_officer)' })
  @ApiQuery({ name: 'opportunityId', required: false, type: Number, description: 'Filter by opportunity ID' })
  @ApiResponse({ status: 200, description: 'List of applications' })
  findAll(@Query('opportunityId') opportunityId?: string) {
    if (opportunityId) {
      return this.service.findByOpportunity(+opportunityId);
    }
    return this.service.findAll();
  }

  @Get('my')
  @Roles('candidate')
  @ApiOperation({ summary: 'Get my applications (candidate) — candidateId=1 by default' })
  @ApiQuery({ name: 'candidateId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Candidate applications' })
  findMine(@Query('candidateId') candidateId?: string) {
    return this.service.findByCandidate(candidateId ? +candidateId : 1);
  }

  @Get('stats')
  @Roles('candidate')
  @ApiOperation({ summary: 'Get application statistics for a candidate' })
  @ApiQuery({ name: 'candidateId', required: false, type: Number })
  getStats(@Query('candidateId') candidateId?: string) {
    return this.service.getStats(candidateId ? +candidateId : 1);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single application by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('candidate')
  @ApiOperation({ summary: 'Apply to an opportunity (candidate only)' })
  @ApiBody({ type: CreateApplicationDto })
  @ApiResponse({ status: 201, description: 'Application submitted' })
  @ApiResponse({ status: 409, description: 'Already applied' })
  apply(@Body() dto: CreateApplicationDto) {
    return this.service.apply(dto);
  }

  @Patch(':id/status')
  @Roles('recruiter', 'placement_officer')
  @ApiOperation({ summary: 'Update application status (recruiter / placement_officer)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateApplicationDto })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateApplicationDto) {
    return this.service.updateStatus(id, dto);
  }

  @Patch(':id/withdraw')
  @Roles('candidate')
  @ApiOperation({ summary: 'Withdraw an application (candidate only)' })
  @ApiParam({ name: 'id', type: Number })
  withdraw(@Param('id', ParseIntPipe) id: number) {
    return this.service.withdraw(id);
  }

  @Delete(':id')
  @Roles('placement_officer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an application (placement_officer only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
