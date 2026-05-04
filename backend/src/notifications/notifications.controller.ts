import {
  Controller, Get, Post, Patch, Delete, Param,
  Body, ParseIntPipe, UseGuards, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiSecurity, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Notifications')
@ApiSecurity('x-role')
@UseGuards(RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @Roles('candidate')
  @ApiOperation({ summary: 'Get all notifications for the candidate' })
  @ApiQuery({ name: 'candidateId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Candidate notifications' })
  findAll(@Query('candidateId') candidateId?: string) {
    return this.service.findByCandidate(candidateId ? +candidateId : 1);
  }

  @Get('unread-count')
  @Roles('candidate')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiQuery({ name: 'candidateId', required: false, type: Number })
  getUnreadCount(@Query('candidateId') candidateId?: string) {
    return this.service.getUnreadCount(candidateId ? +candidateId : 1);
  }

  @Post()
  @Roles('placement_officer')
  @ApiOperation({ summary: 'Create a notification (placement_officer only)' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiQuery({ name: 'candidateId', required: false, type: Number })
  create(@Body() dto: CreateNotificationDto, @Query('candidateId') candidateId?: string) {
    return this.service.create(dto, candidateId ? +candidateId : 1);
  }

  @Patch('read-all')
  @Roles('candidate')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiQuery({ name: 'candidateId', required: false, type: Number })
  markAllRead(@Query('candidateId') candidateId?: string) {
    return this.service.markAllRead(candidateId ? +candidateId : 1);
  }

  @Patch(':id/read')
  @Roles('candidate')
  @ApiOperation({ summary: 'Mark a single notification as read' })
  @ApiParam({ name: 'id', type: Number })
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.service.markRead(id);
  }

  @Patch(':id')
  @Roles('candidate')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNotificationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('candidate', 'placement_officer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
