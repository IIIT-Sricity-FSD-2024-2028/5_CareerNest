import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { ApplicationsModule } from './applications/applications.module';
import { ReferralsModule } from './referrals/referrals.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RecruitersModule } from './recruiters/recruiters.module';

@Module({
  imports: [
    UsersModule,
    OpportunitiesModule,
    ApplicationsModule,
    ReferralsModule,
    AssessmentsModule,
    NotificationsModule,
    RecruitersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
