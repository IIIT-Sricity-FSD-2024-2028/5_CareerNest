import { Injectable } from '@nestjs/common';

export interface Notification {
  id: number;
  candidateId: number;
  type?: string;          // 'assessment' | 'status' | 'offer' | 'general'
  title: string;
  message: string;
  href?: string;          // deep-link route for click navigation
  isRead: boolean;
  createdAt: string;
}

@Injectable()
export class NotificationsRepository {
  private notifications: Notification[] = [
    {
      id: 1,
      candidateId: 1,
      title: 'Offer Extended!',
      message: 'Congratulations! CloudBase Inc has extended an internship offer to you.',
      isRead: false,
      createdAt: '2026-03-01',
    },
    {
      id: 2,
      candidateId: 1,
      title: 'Application Shortlisted',
      message: 'You have been shortlisted for the Technical Assessment at Analytics Hub.',
      isRead: false,
      createdAt: '2026-02-28',
    },
    {
      id: 3,
      candidateId: 1,
      title: 'Interview Scheduled',
      message: 'Your Technical Interview for TechCorp Solutions is scheduled on March 6th, 2026',
      isRead: true,
      createdAt: '2026-02-26',
    },
    {
      id: 4,
      candidateId: 1,
      title: 'New Opportunity Posted',
      message: 'A new Full Stack Developer role at InnovateTech matches your profile. Apply now!',
      isRead: true,
      createdAt: '2026-02-20',
    },
  ];

  private nextId = 5;

  findByCandidate(candidateId: number): Notification[] {
    return this.notifications
      .filter((n) => n.candidateId === candidateId)
      .sort((a, b) => b.id - a.id);   // newest first
  }

  findByType(candidateId: number, type: string): Notification[] {
    return this.notifications.filter(
      (n) => n.candidateId === candidateId && n.type === type,
    );
  }

  findById(id: number): Notification | undefined {
    return this.notifications.find((n) => n.id === id);
  }

  create(data: Omit<Notification, 'id'>): Notification {
    const notif: Notification = { id: this.nextId++, ...data };
    this.notifications.push(notif);
    return notif;
  }

  update(id: number, data: Partial<Notification>): Notification | undefined {
    const idx = this.notifications.findIndex((n) => n.id === id);
    if (idx === -1) return undefined;
    this.notifications[idx] = { ...this.notifications[idx], ...data };
    return this.notifications[idx];
  }

  markAllRead(candidateId: number): void {
    this.notifications
      .filter((n) => n.candidateId === candidateId)
      .forEach((n) => (n.isRead = true));
  }

  remove(id: number): boolean {
    const idx = this.notifications.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    this.notifications.splice(idx, 1);
    return true;
  }
}
