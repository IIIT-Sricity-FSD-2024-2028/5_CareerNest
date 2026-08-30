import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { ApplicationsModule } from './applications/applications.module';
import { ReferralsModule } from './referrals/referrals.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RecruitersModule } from './recruiters/recruiters.module';
import { CollegesModule } from './colleges/colleges.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { FileUploadMiddleware } from './common/middleware/file-upload.middleware';
import { LogFileService } from './common/middleware/log-file.service';

@Module({
  imports: [
    UsersModule,
    OpportunitiesModule,
    ApplicationsModule,
    ReferralsModule,
    AssessmentsModule,
    NotificationsModule,
    RecruitersModule,
    CollegesModule,
    SuperAdminModule,
  ],
  controllers: [AppController],
  // LogFileService is exported so it can be injected into the global
  // AllExceptionsFilter which is instantiated outside the DI container.
  providers: [AppService, LogFileService],
  exports: [LogFileService],
})
export class AppModule implements NestModule {
  /**
   * configure() wires router-level middleware using MiddlewareConsumer.
   *
   * 1. SecurityMiddleware  — applied to ALL routes (security headers + rate limit)
   * 2. LoggerMiddleware    — applied to ALL routes (request/response logging)
   * 3. FileUploadMiddleware — applied only to POST /users/:id/profile-picture
   */
  configure(consumer: MiddlewareConsumer) {
    // ── Security middleware (all routes) ─────────────────────────────────────
    consumer
      .apply(SecurityMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // ── Logging middleware (all routes) ──────────────────────────────────────
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // ── File upload middleware (specific route only) ──────────────────────────
    consumer
      .apply(FileUploadMiddleware)
      .forRoutes({ path: 'users/:id/profile-picture', method: RequestMethod.POST });
  }
}
