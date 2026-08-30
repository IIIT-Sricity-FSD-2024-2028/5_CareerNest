import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
  ParseIntPipe, UseGuards, HttpCode, HttpStatus, Headers, Req,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiBody, ApiSecurity,
  ApiResponse, ApiQuery, ApiHeader, ApiConsumes,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { IsEmail, IsString } from 'class-validator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

/** Minimal DTO for login */
class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

@ApiTags('Users')
@ApiSecurity('x-role')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('placement_officer', 'college_admin', 'super_admin')
  @ApiOperation({
    summary:
      'Get users — super_admin: all users; college_admin/placement_officer: scoped to their college',
  })
  @ApiHeader({ name: 'x-role', required: true })
  @ApiHeader({ name: 'x-college-id', required: false, description: 'Required for college_admin / placement_officer' })
  @ApiQuery({ name: 'role', required: false, description: 'Filter by role' })
  findAll(
    @Headers('x-role') role: string,
    @Headers('x-college-id') collegeIdHeader: string,
    @Query('role') roleFilter?: string,
  ) {
    // super_admin sees everything
    if (role === 'super_admin') {
      return roleFilter ? this.usersService.findByRole(roleFilter) : this.usersService.findAll();
    }
    // college_admin and placement_officer are scoped to their college
    const collegeId =
      collegeIdHeader && collegeIdHeader !== 'null' && collegeIdHeader !== ''
        ? +collegeIdHeader
        : null;
    if (collegeId) {
      return roleFilter
        ? this.usersService.findByRoleAndCollege(roleFilter, collegeId)
        : this.usersService.findByCollege(collegeId);
    }
    // fallback if no collegeId header
    return roleFilter ? this.usersService.findByRole(roleFilter) : this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  /** ── Login (public — no role required) ──────────────────────── */
  @Post('login')
  @ApiOperation({
    summary: 'Validate credentials and return user info for role-based redirect',
    description: 'Returns user object including `collegeId` (null for super_admin). Store in localStorage.',
  })
  @ApiBody({ schema: { example: { email: 'c@gmail.com', password: '123' } } })
  @ApiResponse({ status: 200, description: 'Login successful — returns user without password (includes collegeId)' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }

  @Post()
  @Roles('placement_officer', 'college_admin', 'super_admin')
  @ApiOperation({ summary: 'Create a new user' })
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
  @Roles('placement_officer', 'college_admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  /**
   * POST /users/:id/profile-picture
   * Upload a profile picture for a user.
   *
   * The file is handled by FileUploadMiddleware (multer) applied at the
   * router level via AppModule.configure(). The processed file is available
   * as req.file after the middleware runs.
   */
  @Post(':id/profile-picture')
  @ApiOperation({ summary: 'Upload a profile picture for a user (multipart/form-data)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profile picture (jpeg / png / gif, max 5 MB)',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Profile picture uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or size exceeded' })
  uploadProfilePicture(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      return { statusCode: 400, message: 'No file uploaded. Send a file with field name "file".' };
    }
    return {
      statusCode: 201,
      message: 'Profile picture uploaded successfully',
      userId: id,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: `/uploads/${file.filename}`,
    };
  }
}

