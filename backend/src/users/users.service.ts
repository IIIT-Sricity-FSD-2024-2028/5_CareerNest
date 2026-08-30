import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository, User } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  findAll(): User[] {
    return this.repo.findAll();
  }

  findOne(id: number): User {
    const user = this.repo.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  findByRole(role: string): User[] {
    return this.repo.findByRole(role);
  }

  findByCollege(collegeId: number): User[] {
    return this.repo.findByCollegeId(collegeId);
  }

  findByRoleAndCollege(role: string, collegeId: number): User[] {
    return this.repo.findByRoleAndCollege(role, collegeId);
  }

  create(dto: CreateUserDto): User {
    return this.repo.create(dto as Omit<User, 'id'>);
  }

  update(id: number, dto: UpdateUserDto): User {
    const updated = this.repo.update(id, dto as Partial<User>);
    if (!updated) throw new NotFoundException(`User with id ${id} not found`);
    return updated;
  }

  login(email: string, password: string): Omit<User, 'password'> {
    const user = this.repo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const pwd = user.password ?? '123';   // existing mock users have no password → default '123'
    if (pwd !== password) throw new UnauthorizedException('Invalid email or password');
    // Never return the password field to the client
    const { password: _omit, ...safe } = user as any;
    return safe;
  }

  remove(id: number): { message: string } {
    const removed = this.repo.remove(id);
    if (!removed) throw new NotFoundException(`User with id ${id} not found`);
    return { message: `User ${id} deleted successfully` };
  }
}
