import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatchupService } from '../../../services/catchup.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-rattrapage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rattrapage-container">
      <header class="page-header animate-fade-in">
        <div class="header-content">
          <h1>📅 Séances de Rattrapage</h1>
          <p class="text-muted">Consultez vos séances de rattrapage programmées.</p>
        </div>
      </header>

      <div class="sessions-grid animate-fade-up">
        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Chargement des séances...</p>
        </div>

        <div *ngIf="!loading && sessions.length === 0" class="no-sessions-card glass-card">
          <i class="fas fa-calendar-times"></i>
          <h3>Aucun rattrapage</h3>
          <p>Il n'y a aucune séance de rattrapage programmée pour votre classe actuellement.</p>
        </div>

        <div *ngIf="!loading && sessions.length > 0" class="sessions-list">
          <div *ngFor="let session of sessions" class="session-card glass-card" [class.cancelled]="session.status === 'cancelled'">
            <div class="session-date">
              <span class="day">{{ session.date | date:'dd' }}</span>
              <span class="month">{{ session.date | date:'MMM' }}</span>
            </div>
            
            <div class="session-main">
              <div class="session-header">
                <span class="subject">{{ session.subject?.name }}</span>
                <span class="status-badge" [class]="session.status">{{ session.status }}</span>
              </div>
              
              <div class="session-details">
                <div class="detail-item">
                  <i class="fas fa-clock"></i>
                  <span>{{ session.startTime }} - {{ session.endTime }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Salle: {{ session.room }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-user-tie"></i>
                  <span>Prof: {{ session.teacher?.name }}</span>
                </div>
              </div>

              <div *ngIf="session.description" class="session-description">
                <p>{{ session.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rattrapage-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .page-header {
      margin-bottom: 1rem;
      h1 { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
    }

    .glass-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      border: 1px solid #f1f5f9;
    }

    .no-sessions-card {
      text-align: center;
      padding: 4rem 2rem;
      i { font-size: 4rem; color: #cbd5e1; margin-bottom: 1.5rem; }
      h3 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
      p { color: #64748b; }
    }

    .sessions-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .session-card {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      transition: transform 0.3s ease;
      
      &:hover { transform: translateY(-5px); }

      &.cancelled {
        opacity: 0.7;
        filter: grayscale(0.5);
      }
    }

    .session-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 70px;
      height: 70px;
      background: #f0f7ff;
      border-radius: 16px;
      color: #0055a4;
      
      .day { font-size: 1.5rem; font-weight: 800; }
      .month { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
    }

    .session-main {
      flex: 1;
    }

    .session-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      
      .subject { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
      
      .status-badge {
        font-size: 0.7rem;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 20px;
        text-transform: uppercase;
        
        &.published { background: #dcfce7; color: #15803d; }
        &.draft { background: #fef9c3; color: #a16207; }
        &.cancelled { background: #fee2e2; color: #b91c1c; }
      }
    }

    .session-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.8rem;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.85rem;
      color: #64748b;
      i { color: #0055a4; width: 14px; }
    }

    .session-description {
      font-size: 0.85rem;
      color: #475569;
      padding-top: 0.8rem;
      border-top: 1px solid #f1f5f9;
      line-height: 1.5;
    }

    .loading-state {
      text-align: center;
      padding: 4rem;
      color: #64748b;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0055a4;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    @media (max-width: 640px) {
      .sessions-list { grid-template-columns: 1fr; }
      .session-card { flex-direction: column; gap: 1rem; }
      .session-date { width: 100%; height: auto; padding: 0.8rem; flex-direction: row; gap: 0.5rem; }
      .session-details { grid-template-columns: 1fr; }
    }
  `]
})
export class RattrapageComponent implements OnInit {
  sessions: any[] = [];
  loading = true;
  currentUser: any;

  constructor(
    private catchupService: CatchupService,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    const departmentId = this.currentUser?.department?._id || this.currentUser?.department;

    if (!departmentId) {
      this.loading = false;
      return;
    }

    // Fetch by department (passing undefined for classGroup and teacher)
    this.catchupService.getCatchupSessions(undefined, undefined, departmentId).subscribe({
      next: (data) => {
        this.sessions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading catchup sessions', err);
        this.loading = false;
      }
    });
  }
}
