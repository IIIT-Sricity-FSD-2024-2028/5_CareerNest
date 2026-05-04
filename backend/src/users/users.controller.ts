import {
  Controller, Get, Post, Put, Delete, Param, Body,
  ParseIntPipe, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiSecurity, ApiResponse } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

/** Minimal DTO for login — not whitelisted by global ValidationPipe but defined here for Swagger */
class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

@ApiTags('Users')
@ApiSecurity('x-role')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles('placement_officer')
  @ApiOperation({ summary: 'Get all users (placement_officer only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  /** ── Login (public — no role required) ────────────────────── */
  @Post('login')
  @ApiOperation({ summary: 'Validate credentials and return user info for role-based redirect' })
  @ApiBody({ schema: { example: { email: 'c@gmail.com', password: '123' } } })
  @ApiResponse({ status: 200, description: 'Login successful — returns user without password' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }

  @Post()
  @Roles('placement_officer')
  @ApiOperation({ summary: 'Create a new user (placement_officer only)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user profile' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('placement_officer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user (placement_officer only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
