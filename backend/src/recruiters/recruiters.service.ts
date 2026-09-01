import { Injectable, NotFoundException } from '@nestjs/common';
import { RecruitersRepository, Recruiter } from './recruiters.repository';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';

@Injectable()
export class RecruitersService {
  constructor(private readonly repo: RecruitersRepository) {}

  findAll(): Recruiter[] {
    return this.repo.findAll();
  }

  findOne(id: number): Recruiter {
    const r = this.repo.findById(id);
    if (!r) throw new NotFoundException(`Recruiter with id ${id} not found`);
    return r;
  }

  findByStatus(status: string): Recruiter[] {
    return this.repo.findByStatus(status);
  }

  getStats(): Record<string, number> {
    return this.repo.getStats();
  }

  create(dto: CreateRecruiterDto): Recruiter {
    const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return this.repo.create({
      ...dto,
      status: 'pending',
      opps: 0,
      joined: now,
      avatar: dto.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    });
  }

  update(id: number, dto: UpdateRecruiterDto): Recruiter {
    const updated = this.repo.update(id, dto as Partial<Recruiter>);
    if (!updated) throw new NotFoundException(`Recruiter with id ${id} not found`);
    return updated;
  }

  approve(id: number): Recruiter {
    const r = this.repo.findById(id);
    if (!r) throw new NotFoundException(`Recruiter with id ${id} not found`);
    return this.repo.update(id, { status: 'active' })!;
  }

  decline(id: number): Recruiter {
    const r = this.repo.findById(id);
    if (!r) throw new NotFoundException(`Recruiter with id ${id} not found`);
    return this.repo.update(id, { status: 'declined' })!;
  }

  remove(id: number): { message: string } {
    const removed = this.repo.remove(id);
    if (!removed) throw new NotFoundException(`Recruiter with id ${id} not found`);
    return { message: `Recruiter ${id} removed successfully` };
  }
}
