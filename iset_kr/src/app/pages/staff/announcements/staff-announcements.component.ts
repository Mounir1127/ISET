import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../services/staff.service';

@Component({
  selector: 'app-staff-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="announcements-page">
      <!-- HEADER -->
      <div class="header-wrap glass-card">
        <div class="header-main">
          <div class="title-wrap">
            <h2>Annonces Pédagogiques</h2>
            <p>Communiquez des informations importantes à vos étudiants.</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" (click)="openCreateModal()">
              <i class="fas fa-plus"></i> Nouvelle Annonce
            </button>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="announcements-list">
        <div *ngFor="let ann of announcements" class="ann-card glass-card" [class.urgent]="ann.priority === 'high'">
          <div class="ann-header">
            <div class="ann-meta">
              <span class="category-tag">{{ ann.category }}</span>
              <span class="date-tag"><i class="far fa-calendar"></i> {{ ann.publishDate | date:'mediumDate' }}</span>
              <span class="target-tag"><i class="fas fa-users"></i> {{ ann.target }}</span>
            </div>
            <div class="ann-options">
              <button class="icon-btn" (click)="openEditModal(ann)"><i class="fas fa-edit"></i></button>
              <button class="icon-btn delete" (click)="deleteAnnouncement(ann._id)"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          
          <div class="ann-body">
            <h3>{{ ann.title }}</h3>
            <p>{{ ann.content }}</p>
          </div>
          
          <div class="ann-footer">
            <div class="priority-indicator" [class.high]="ann.priority === 'high'">
              <i class="fas fa-circle"></i> Priorité {{ ann.priority === 'high' ? 'Haute' : 'Normale' }}
            </div>
            <div class="stats-mini">
              <!-- Placeholder stats -->
              <span><i class="far fa-eye"></i> 0 vues</span>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state glass-card" *ngIf="announcements.length === 0 && !isLoading">
          <i class="fas fa-bullhorn"></i>
          <h3>Aucune annonce publiée</h3>
          <p>Commencez à informer vos étudiants dès maintenant.</p>
        </div>
        
        <div class="loading-state" *ngIf="isLoading">
           <i class="fas fa-circle-notch fa-spin"></i>
           <p>Chargement...</p>
        </div>
      </div>

      <!-- CREATE/EDIT MODAL -->
      <div class="modal-overlay" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
            <button class="close-btn" (click)="closeModal()"><i class="fas fa-times"></i></button>
            
            <div class="modal-header">
                <h2>{{ isEditMode ? 'Modifier' : 'Nouvelle' }} Annonce</h2>
            </div>

            <div class="modal-form">
                <div class="form-group">
                    <label>Titre de l'annonce</label>
                    <input type="text" [(ngModel)]="currentAnnouncement.title" placeholder="Ex: Devoir de rattrapage...">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Catégorie</label>
                        <select [(ngModel)]="currentAnnouncement.category">
                            <option value="Information">Information</option>
                            <option value="Évaluation">Évaluation</option>
                            <option value="Planning">Planning</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Priorité</label>
                        <select [(ngModel)]="currentAnnouncement.priority">
                            <option value="normal">Normale</option>
                            <option value="high">Haute</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Cible (Classes concernées)</label>
                    <input type="text" [(ngModel)]="currentAnnouncement.target" placeholder="Ex: DSI 3.1, Tout le département...">
                    <!-- Idealement un multi-select ici -->
                </div>

                <div class="form-group">
                    <label>Contenu</label>
                    <textarea [(ngModel)]="currentAnnouncement.content" rows="5" placeholder="Votre message..."></textarea>
                </div>

                <div class="modal-actions">
                    <button class="btn-cancel" (click)="closeModal()">Annuler</button>
                    <button class="btn-save" (click)="saveAnnouncement()" [disabled]="isLoading">
                        {{ isLoading ? 'Enregistrement...' : 'Publier' }}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .announcements-page { display: flex; flex-direction: column; gap: 2rem; animation: slideIn 0.6s ease; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 24px;
      padding: 2.2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    }

    .header-main {
      display: flex; justify-content: space-between; align-items: center;
      h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; }
      p { color: #64748b; font-weight: 500; }
      .btn-primary {
        background: #0055a4; color: white; border: none; padding: 0.9rem 1.8rem;
        border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.8rem;
        transition: all 0.3s; &:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0, 85, 164, 0.2); }
      }
    }

    .announcements-list { display: flex; flex-direction: column; gap: 1.5rem; }

    .ann-card {
      transition: all 0.3s;
      &:hover { transform: scale(1.01); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
      &.urgent { border-left: 6px solid #ef4444; }

      .ann-header {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
        .ann-meta {
          display: flex; gap: 1.2rem; align-items: center;
          .category-tag { background: #eff6ff; color: #0055a4; padding: 0.3rem 0.8rem; border-radius: 8px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; }
          .date-tag, .target-tag { font-size: 0.8rem; font-weight: 600; color: #94a3b8; display: flex; align-items: center; gap: 0.4rem; i { color: #cbd5e1; } }
        }
        .icon-btn {
          background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem; margin-left: 0.8rem;
          &:hover { color: #0055a4; }
          &.delete:hover { color: #ef4444; }
        }
      }

      .ann-body {
        h3 { font-size: 1.4rem; font-weight: 900; color: #0f172a; margin-bottom: 0.8rem; }
        p { color: #475569; line-height: 1.6; font-weight: 500; font-size: 1.05rem; }
      }

      .ann-footer {
        margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9;
        display: flex; justify-content: space-between; align-items: center;
        
        .priority-indicator {
          font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 0.6rem; color: #10b981;
          i { font-size: 0.6rem; }
          &.high { color: #ef4444; }
        }
        .stats-mini { color: #94a3b8; font-size: 0.85rem; font-weight: 600; }
      }
    }

    .empty-state { text-align: center; padding: 5rem; i { font-size: 4rem; color: #f1f5f9; margin-bottom: 2rem; display: block; } }
    .loading-state { text-align: center; padding: 3rem; color: #64748b; i { font-size: 2rem; margin-bottom: 0.5rem; } }

    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
    .modal-card { background: white; width: 95%; max-width: 600px; border-radius: 20px; padding: 2rem; position: relative; animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
    .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; color: #64748b; cursor: pointer; transition: 0.2s; &:hover { background: #e2e8f0; color: #ef4444; } }
    
    .modal-header h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1.5rem; }
    
    .modal-form { display: flex; flex-direction: column; gap: 1.2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; label { font-size: 0.85rem; font-weight: 700; color: #475569; } input, select, textarea { padding: 0.8rem 1rem; border: 1px solid #e2e8f0; border-radius: 10px; font-family: inherit; font-size: 0.95rem; &:focus { outline: none; border-color: #0055a4; box-shadow: 0 0 0 3px rgba(0, 85, 164, 0.1); } } textarea { resize: vertical; } }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    .btn-cancel { background: #f1f5f9; color: #64748b; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; font-weight: 700; cursor: pointer; &:hover { background: #e2e8f0; } }
    .btn-save { background: #0055a4; color: white; border: none; padding: 0.8rem 2rem; border-radius: 10px; font-weight: 700; cursor: pointer; &:hover { background: #004484; transform: translateY(-1px); } &:disabled { opacity: 0.7; cursor: not-allowed; } }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class StaffAnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  groups: any[] = [];

  // Modal State
  isModalOpen = false;
  isEditMode = false;
  currentAnnouncement: any = {
    title: '',
    content: '',
    category: 'Information',
    target: '',
    priority: 'normal'
  };

  isLoading = false;

  constructor(private staffService: StaffService) { }

  ngOnInit(): void {
    this.loadAnnouncements();
    // Load groups ideally here if service supports it, mocking for now as select options
    this.groups = [
      { name: 'DSI 3.1' }, { name: 'DSI 3.2' }, { name: 'RSI 2.1' }, { name: 'SEM 1.1' }
    ];
  }

  loadAnnouncements() {
    this.isLoading = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.staffService.getAnnouncements(user.id).subscribe({
      next: (data) => {
        this.announcements = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading announcements', err);
        this.isLoading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentAnnouncement = {
      title: '',
      content: '',
      category: 'Information',
      target: '',
      priority: 'normal',
      author: JSON.parse(localStorage.getItem('user') || '{}').id
    };
    this.isModalOpen = true;
  }

  openEditModal(ann: any) {
    this.isEditMode = true;
    this.currentAnnouncement = { ...ann };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveAnnouncement() {
    if (!this.currentAnnouncement.title || !this.currentAnnouncement.content) return;

    this.isLoading = true;
    if (this.isEditMode) {
      this.staffService.updateAnnouncement(this.currentAnnouncement._id, this.currentAnnouncement).subscribe(() => {
        this.loadAnnouncements();
        this.closeModal();
      });
    } else {
      this.staffService.createAnnouncement(this.currentAnnouncement).subscribe(() => {
        this.loadAnnouncements();
        this.closeModal();
      });
    }
  }

  deleteAnnouncement(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      this.isLoading = true;
      this.staffService.deleteAnnouncement(id).subscribe(() => {
        this.loadAnnouncements();
      });
    }
  }
}
