import { Module, forwardRef } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationsRepository } from './applications.repository';
import { OpportunitiesModule } from '../opportunities/opportunities.module';
import { AssessmentsModule } from '../assessments/assessments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [OpportunitiesModule, forwardRef(() => AssessmentsModule), NotificationsModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationsRepository],
  exports: [ApplicationsService, ApplicationsRepository],
})
export class ApplicationsModule {}

