import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CollegesRepository, College } from './colleges.repository';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Injectable()
export class CollegesService {
  constructor(private readonly repo: CollegesRepository) {}

  findAll(): College[] {
    return this.repo.findAll();
  }

  findOne(id: number): College {
    const college = this.repo.findById(id);
    if (!college) throw new NotFoundException(`College with id ${id} not found`);
    return college;
  }

  create(dto: CreateCollegeDto): College {
    const existing = this.repo.findByCode(dto.code);
    if (existing) throw new ConflictException(`College with code '${dto.code}' already exists`);
    const now = new Date().toISOString().split('T')[0];
    return this.repo.create({
      ...dto,
      status: dto.status ?? 'active',
      // Default to basic subscription tier when onboarding a new college
      subscriptionTier: (dto as any).subscriptionTier ?? 'basic',
      subscriptionFee:  (dto as any).subscriptionFee  ?? 15000,
      recruiterTier:    (dto as any).recruiterTier     ?? 'free',
      driveFee:         (dto as any).driveFee          ?? 0,
      drivesThisYear:   (dto as any).drivesThisYear    ?? 0,
      studentLimit:     (dto as any).studentLimit      ?? 200,
      createdAt: now,
      updatedAt: now,
    });
  }

  update(id: number, dto: UpdateCollegeDto): College {
    const updated = this.repo.update(id, dto as Partial<College>);
    if (!updated) throw new NotFoundException(`College with id ${id} not found`);
    return updated;
  }

  updateStatus(id: number, status: 'active' | 'inactive' | 'suspended'): College {
    const updated = this.repo.update(id, { status });
    if (!updated) throw new NotFoundException(`College with id ${id} not found`);
    return updated;
  }

  remove(id: number): { message: string } {
    const removed = this.repo.remove(id);
    if (!removed) throw new NotFoundException(`College with id ${id} not found`);
    return { message: `College ${id} deleted` };
  }
}
