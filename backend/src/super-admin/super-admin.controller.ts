import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body, ParseIntPipe, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiSecurity, ApiResponse } from '@nestjs/swagger';
import { SuperAdminService } from './super-admin.service';
import { CollegesService } from '../colleges/colleges.service';
import { CreateCollegeDto } from '../colleges/dto/create-college.dto';
import { UpdateCollegeDto } from '../colleges/dto/update-college.dto';
import { CollegeStatusDto } from '../colleges/dto/college-status.dto';
import { CreateCollegeAdminDto } from './dto/create-college-admin.dto';
import { UpdateCollegeAdminDto } from './dto/update-college-admin.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AdminStatusDto {
  @ApiProperty({ enum: ['active', 'inactive'] })
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}

@ApiTags('Super Admin')
@ApiSecurity('x-role')
@UseGuards(RolesGuard)
@Roles('super_admin')
@Controller('super-admin')
export class SuperAdminController {
  constructor(
    private readonly superAdminService: SuperAdminService,
    private readonly collegesService: CollegesService,
  ) {}

  // ── Platform Stats ─────────────────────────────────────────────────────────
  @Get('stats')
  @ApiOperation({ summary: 'Platform-wide statistics (super_admin only)' })
  getStats() {
    return this.superAdminService.getPlatformStats();
  }

  // ── Revenue Model ──────────────────────────────────────────────────────────
  @Get('revenue')
  @ApiOperation({ summary: 'Revenue model — MRR, ARR, tier breakdown, drive fees (super_admin only)' })
  getRevenue() {
    return this.superAdminService.getRevenueStats();
  }

  // ── Colleges ───────────────────────────────────────────────────────────────
  @Get('colleges')
  @ApiOperation({ summary: 'All colleges with admin info and per-college stats (super_admin only)' })
  getAllColleges() {
    return this.superAdminService.getAllCollegesWithAdmins();
  }

  @Post('colleges')
  @ApiOperation({ summary: 'Create a new college (super_admin only)' })
  @ApiBody({ type: CreateCollegeDto })
  @ApiResponse({ status: 201 })
  createCollege(@Body() dto: CreateCollegeDto) {
    return this.collegesService.create(dto);
  }

  @Get('colleges/:id')
  @ApiOperation({ summary: 'Single college with admin + stats (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  getCollege(@Param('id', ParseIntPipe) id: number) {
    return this.superAdminService.getCollegeWithAdmin(id);
  }

  @Put('colleges/:id')
  @ApiOperation({ summary: 'Update college details (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCollegeDto })
  updateCollege(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCollegeDto) {
    return this.collegesService.update(id, dto);
  }

  @Patch('colleges/:id/status')
  @ApiOperation({ summary: 'Update college status (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CollegeStatusDto })
  updateCollegeStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: CollegeStatusDto) {
    return this.collegesService.updateStatus(id, dto.status);
  }

  @Patch('colleges/:id/subscription')
  @ApiOperation({ summary: 'Change college subscription tier — basic | standard | premium (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  updateCollegeSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { tier: 'basic' | 'standard' | 'premium' },
  ) {
    return this.superAdminService.changeSubscriptionTier(id, dto.tier);
  }

  @Delete('colleges/:id')
  @Roles('super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a college (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  deleteCollege(@Param('id', ParseIntPipe) id: number) {
    return this.collegesService.remove(id);
  }

  // ── College Admins ─────────────────────────────────────────────────────────
  @Get('colleges/:id/admin')
  @ApiOperation({ summary: 'Get the college admin for a college (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  getCollegeAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.superAdminService.getCollegeAdmin(id);
  }

  @Post('colleges/:id/admin')
  @ApiOperation({ summary: 'Create/assign a college admin (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateCollegeAdminDto })
  @ApiResponse({ status: 201 })
  createCollegeAdmin(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCollegeAdminDto) {
    return this.superAdminService.createCollegeAdmin(id, dto);
  }

  @Put('colleges/:id/admin')
  @ApiOperation({ summary: 'Update college admin details (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCollegeAdminDto })
  updateCollegeAdmin(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCollegeAdminDto) {
    return this.superAdminService.updateCollegeAdmin(id, dto);
  }

  @Patch('colleges/:id/admin/status')
  @ApiOperation({ summary: 'Activate/deactivate college admin (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AdminStatusDto })
  toggleCollegeAdminStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: AdminStatusDto) {
    return this.superAdminService.toggleCollegeAdminStatus(id, dto.status);
  }

  // ── College Users ──────────────────────────────────────────────────────────
  @Get('colleges/:id/users')
  @ApiOperation({ summary: 'Get all users of a specific college (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  getCollegeUsers(@Param('id', ParseIntPipe) id: number) {
    return this.superAdminService.getCollegeUsers(id);
  }
}
