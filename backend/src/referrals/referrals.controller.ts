import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  ParseIntPipe, UseGuards, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiSecurity, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Referrals')
@ApiSecurity('x-role')
@UseGuards(RolesGuard)
@Controller('referrals')
export class ReferralsController {
  constructor(private readonly service: ReferralsService) {}

  @Get()
  @Roles('alumni', 'placement_officer')
  @ApiOperation({ summary: 'Get all referrals (alumni / placement_officer)' })
  @ApiQuery({ name: 'alumniId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of referrals' })
  findAll(@Query('alumniId') alumniId?: string) {
    if (alumniId) return this.service.findByAlumni(+alumniId);
    return this.service.findAll();
  }

  @Get('my')
  @Roles('candidate')
  @ApiOperation({ summary: 'Get my referral requests (candidate only)' })
  @ApiQuery({ name: 'candidateId', required: false, type: Number })
  findMine(@Query('candidateId') candidateId?: string) {
    return this.service.findByCandidate(candidateId ? +candidateId : 1);
  }

  @Get('stats')
  @Roles('alumni')
  @ApiOperation({ summary: 'Get referral statistics for an alumni' })
  @ApiQuery({ name: 'alumniId', required: false, type: Number })
  getStats(@Query('alumniId') alumniId?: string) {
    return this.service.getStats(alumniId ? +alumniId : 7);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single referral by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('candidate')
  @ApiOperation({ summary: 'Request a referral (candidate only)' })
  @ApiBody({ type: CreateReferralDto })
  @ApiResponse({ status: 201, description: 'Referral request created' })
  create(@Body() dto: CreateReferralDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('alumni')
  @ApiOperation({ summary: 'Approve or decline a referral (alumni only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateReferralDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReferralDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('candidate', 'placement_officer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a referral request (candidate / placement_officer)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
