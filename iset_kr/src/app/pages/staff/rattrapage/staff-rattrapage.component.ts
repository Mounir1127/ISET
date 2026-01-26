import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatchupService } from '../../../services/catchup.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-staff-rattrapage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="staff-rattrapage-container">
      <header class="page-header animate-fade-in">
        <div class="header-content">
          <h1>🛠️ Gestion des Rattrapages</h1>
          <p class="text-muted">Créez et gérez les séances de rattrapage pour vos classes.</p>
        </div>
        <button class="btn-primary" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> Nouvelle Séance
        </button>
      </header>

      <!-- SESSIONS TABLE -->
      <div class="glass-card animate-fade-up">
        <div class="table-container">
          <table *ngIf="sessions.length > 0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Heure</th>
                <th>Classe</th>
                <th>Matière</th>
                <th>Salle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let session of sessions">
                <td>{{ session.date | date:'dd/MM/yyyy' }}</td>
                <td>{{ session.startTime }} - {{ session.endTime }}</td>
                <td>{{ session.classGroup?.name }}</td>
                <td>{{ session.subject?.name }}</td>
                <td>{{ session.room }}</td>
                <td>
                  <span class="status-badge" [class]="session.status">{{ session.status }}</span>
                </td>
                <td class="actions">
                  <button (click)="editSession(session)" class="btn-icon" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button (click)="deleteSession(session._id)" class="btn-icon delete" title="Supprimer">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="sessions.length === 0 && !loading" class="no-data">
            <i class="fas fa-calendar-alt"></i>
            <p>Aucune séance de rattrapage trouvée.</p>
          </div>
        </div>
      </div>

      <!-- CREATE/EDIT MODAL -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content glass-card" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h2>{{ isEditing ? 'Modifier' : 'Nouvelle' }} Séance de Rattrapage</h2>
            <button class="close-btn" (click)="closeModal()"><i class="fas fa-times"></i></button>
          </header>

          <form (ngSubmit)="saveSession()" #sessionForm="ngForm">
            <div class="form-grid">
              <div class="form-group">
                <label>Classe</label>
                <select name="classGroup" [(ngModel)]="currentSession.classGroup" required>
                  <option *ngFor="let class of classes" [value]="class._id">{{ class.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Matière</label>
                <select name="subject" [(ngModel)]="currentSession.subject" required>
                  <option *ngFor="let sub of subjects" [value]="sub._id">{{ sub.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Date</label>
                <input type="date" name="date" [(ngModel)]="currentSession.date" required>
              </div>

              <div class="form-group">
                <label>Salle</label>
                <input type="text" name="room" [(ngModel)]="currentSession.room" placeholder="ex: Salle 101" required>
              </div>

              <div class="form-group">
                <label>Heure Début</label>
                <input type="time" name="startTime" [(ngModel)]="currentSession.startTime" required>
              </div>

              <div class="form-group">
                <label>Heure Fin</label>
                <input type="time" name="endTime" [(ngModel)]="currentSession.endTime" required>
              </div>

              <div class="form-group full-width">
                <label>Statut</label>
                <select name="status" [(ngModel)]="currentSession.status">
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label>Notes / Description (Optionnel)</label>
                <textarea name="description" [(ngModel)]="currentSession.description" rows="3"></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn-primary" [disabled]="!sessionForm.valid">
                {{ isEditing ? 'Mettre à jour' : 'Créer la séance' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .staff-rattrapage-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h1 { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0; }
    }

    .glass-card {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      border: 1px solid #f1f5f9;
    }

    .table-container {
      overflow-x: auto;
      table {
        width: 100%;
        border-collapse: collapse;
        th { text-align: left; padding: 1.2rem; color: #64748b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #f1f5f9; }
        td { padding: 1.2rem; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 0.95rem; }
      }
    }

    .btn-primary {
      background: #0055a4;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover { background: #004488; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 85, 164, 0.2); }
      &:disabled { background: #ccc; cursor: not-allowed; }
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #475569;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-icon {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 1.1rem;
      transition: all 0.2s;
      &:hover { color: #0055a4; }
      &.delete:hover { color: #ef4444; }
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      &.published { background: #dcfce7; color: #15803d; }
      &.draft { background: #fef9c3; color: #a16207; }
      &.cancelled { background: #fee2e2; color: #b91c1c; }
    }

    .no-data {
      padding: 4rem;
      text-align: center;
      color: #94a3b8;
      i { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
    }

    /* MODAL */
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }

    .modal-content {
      width: 100%; max-width: 600px; padding: 2.5rem;
    }

    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 2rem;
      h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
      .close-btn { background: none; border: none; font-size: 1.2rem; color: #64748b; cursor: pointer; }
    }

    .form-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;
    }

    .form-group {
      display: flex; flex-direction: column; gap: 0.5rem;
      &.full-width { grid-column: span 2; }
      label { font-size: 0.85rem; font-weight: 700; color: #475569; }
      input, select, textarea {
        padding: 0.8rem; border: 1px solid #e2e8f0; border-radius: 10px; font-family: inherit;
        &:focus { outline: none; border-color: #0055a4; box-shadow: 0 0 0 3px rgba(0, 85, 164, 0.1); }
      }
    }

    .modal-footer {
      display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2.5rem;
    }

    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-fade-up { animation: fadeUp 0.4s ease-out both; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class StaffRattrapageComponent implements OnInit {
  sessions: any[] = [];
  classes: any[] = [];
  subjects: any[] = [];
  currentUser: any;
  loading = true;
  showModal = false;
  isEditing = false;
  currentSession: any = this.getEmptySession();

  constructor(
    private catchupService: CatchupService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
    this.loadData();
  }

  getEmptySession() {
    return {
      classGroup: '',
      subject: '',
      teacher: '',
      date: '',
      startTime: '',
      endTime: '',
      room: '',
      status: 'published',
      description: ''
    };
  }

  loadData() {
    const teacherId = this.currentUser?.id || this.currentUser?._id;
    if (!teacherId) return;

    // Load sessions
    this.catchupService.getCatchupSessions(undefined, teacherId).subscribe(data => {
      this.sessions = data;
      this.loading = false;
    });

    // Load classes (assigned to teacher)
    this.http.get<any[]>(`${environment.apiUrl}/public/classes`).subscribe(data => {
      // In a real scenario, filter classes by teacher's assigned classes
      this.classes = data;
    });

    // Load subjects
    this.http.get<any[]>(`${environment.apiUrl}/public/modules`).subscribe(data => {
      this.subjects = data;
    });
  }

  openCreateModal() {
    this.currentSession = this.getEmptySession();
    this.currentSession.teacher = this.currentUser?.id || this.currentUser?._id;
    this.isEditing = false;
    this.showModal = true;
  }

  editSession(session: any) {
    this.isEditing = true;
    this.currentSession = {
      ...session,
      classGroup: session.classGroup?._id || session.classGroup,
      subject: session.subject?._id || session.subject,
      date: new Date(session.date).toISOString().split('T')[0]
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveSession() {
    if (this.isEditing) {
      this.catchupService.updateCatchupSession(this.currentSession._id, this.currentSession).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    } else {
      this.catchupService.createCatchupSession(this.currentSession).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    }
  }

  deleteSession(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette séance ?')) {
      this.catchupService.deleteCatchupSession(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
