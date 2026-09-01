import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller';
import { FeaturesRepository } from './features.repository';
import { CollegesModule } from '../colleges/colleges.module';

@Module({
  imports: [CollegesModule],
  controllers: [FeaturesController],
  providers: [FeaturesRepository],
  exports: [FeaturesRepository],
})
export class FeaturesModule {}
