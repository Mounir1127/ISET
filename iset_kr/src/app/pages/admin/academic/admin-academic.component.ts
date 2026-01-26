import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-academic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="academic-management">
      <div class="welcome-header">
        <div class="header-text">
          <h3>Services Académiques</h3>
          <p>Gestion centrale des emplois du temps.</p>
        </div>
      </div>

      <div class="section-content">
        <div class="schedule-editor">
             <div class="filter-bar glass-card">
                <label><i class="fas fa-filter"></i> Filtrer par classe :</label>
                <select [(ngModel)]="selectedClassFilter" (change)="onClassFilterChange()">
                    <option value="">Toutes les classes</option>
                    <option *ngFor="let c of classes" [value]="c._id">{{ c.name }}</option>
                </select>
             </div>

             <!-- Modal for Adding Schedule -->
             <div class="modal-overlay" *ngIf="displayModal" (click)="closeModal()">
                <div class="modal-card" (click)="$event.stopPropagation()">
                   <div class="modal-header">
                      <h3><i class="fas fa-calendar-plus"></i> Ajouter une séance</h3>
                      <button class="btn-close" (click)="closeModal()">
                         <i class="fas fa-times"></i>
                      </button>
                   </div>
                   
                   <div class="modal-body">
                      <div class="info-banner" *ngIf="selectedClassFilter">
                         <i class="fas fa-info-circle"></i>
                         <span>{{ getClassName(selectedClassFilter) }} - {{ modalData.day }} {{ modalData.startTime }}-{{ modalData.endTime }}</span>
                      </div>

                      <div *ngIf="validationError" class="error-banner">
                         <i class="fas fa-exclamation-triangle"></i>
                         <span>{{ validationError }}</span>
                      </div>

                      <div class="form-fields">
                         <div class="field-group">
                            <label><i class="fas fa-chalkboard-teacher"></i> Enseignant</label>
                            <select [(ngModel)]="newSchedule.staff">
                               <option value="" disabled>Sélectionnez un enseignant</option>
                               <option *ngFor="let s of staffMembers" [value]="s._id">{{ s.name }}</option>
                            </select>
                         </div>

                         <div class="field-group">
                            <label><i class="fas fa-book"></i> Matière</label>
                            <select [(ngModel)]="newSchedule.subject">
                               <option value="" disabled>Sélectionnez une matière</option>
                               <option *ngFor="let sub of subjects" [value]="sub._id">{{ sub.name }}</option>
                            </select>
                         </div>

                         <div class="field-group">
                            <label><i class="fas fa-door-open"></i> Salle</label>
                            <input type="text" placeholder="Ex: A102, B205..." [(ngModel)]="newSchedule.room">
                         </div>

                         <div class="field-group">
                            <label><i class="fas fa-tag"></i> Type de séance</label>
                            <div class="type-selector">
                               <button 
                                  *ngFor="let t of types" 
                                  class="type-btn" 
                                  [class.active]="newSchedule.type === t"
                                  [class.cours]="t === 'Cours'"
                                  [class.td]="t === 'TD'"
                                  [class.tp]="t === 'TP'"
                                  (click)="newSchedule.type = t">
                                  {{ t }}
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div class="modal-footer">
                      <button class="btn-cancel" (click)="closeModal()">
                         <i class="fas fa-times"></i> Annuler
                      </button>
                      <button class="btn-save" (click)="addSchedule()" [disabled]="!newSchedule.staff || !newSchedule.room || !newSchedule.subject">
                         <i class="fas fa-check"></i> Enregistrer
                      </button>
                   </div>
                </div>
             </div>

             <!-- Grid View (Only when class is selected) -->
             <div class="schedule-grid-container custom-scrollbar" *ngIf="selectedClassFilter">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th class="time-col">Heure</th>
                            <th *ngFor="let day of days">{{ day | uppercase }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let slot of timeSlots">
                            <td class="time-cell">
                                <span class="start">{{ slot.start }}</span>
                                <span class="end">{{ slot.end }}</span>
                            </td>
                            <td *ngFor="let day of days" class="session-cell" 
                                [class.empty]="!getSession(day, slot.start)"
                                (click)="openAddModal(day, slot.start, slot.end)">
                                
                                <div *ngIf="getSession(day, slot.start) as session" class="session-block" [ngClass]="session.type?.toLowerCase()">
                                    <div class="session-main">
                                        <span class="module-name" [title]="session.subject?.name || session.module?.name">
                                            {{ session.subject?.name || session.module?.name || 'Matière' }}
                                        </span>
                                        <div class="session-info">
                                            <span class="info-item" title="Enseignant">
                                                <i class="fas fa-chalkboard-teacher"></i> 
                                                <span>{{ session.staff?.name || 'Inconnu' }}</span>
                                            </span>
                                            <span class="info-item" title="Salle">
                                                <i class="fas fa-door-open"></i> 
                                                <span>{{ session.room || 'N/A' }}</span>
                                            </span>
                                            <span class="info-item" title="Classe">
                                                <i class="fas fa-users"></i> 
                                                <span>{{ session.classGroup?.name || 'N/A' }}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <button class="btn-delete-mini" (click)="$event.stopPropagation(); deleteSchedule(session._id)">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                <div *ngIf="!getSession(day, slot.start)" class="add-placeholder">
                                    <i class="fas fa-plus"></i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
             </div>

             <!-- List View (Fallback or Summary) -->
             <div class="schedule-list" *ngIf="!selectedClassFilter">
                 <div class="info-message">
                    <i class="fas fa-info-circle"></i>
                    <p>Sélectionnez une classe ci-dessus pour voir la grille hebdomadaire interactive.</p>
                 </div>
                 <div class="day-group" *ngFor="let day of days">
                    <h5 *ngIf="getSchedulesForDay(day).length > 0">{{ day }}</h5>
                    <div class="session-card" *ngFor="let s of getSchedulesForDay(day)">
                        <div class="time">{{ s.startTime }} - {{ s.endTime }}</div>
                        <div class="details">
                            <div class="main-info">
                                <strong>{{ s.subject?.name || 'Matière' }}</strong>
                                <span class="type-badge" [ngClass]="s.type.toLowerCase()">{{ s.type }}</span>
                            </div>
                            <div class="sub-info">
                                <span><i class="fas fa-users"></i> {{ s.classGroup?.name }}</span>
                                <span><i class="fas fa-chalkboard-teacher"></i> {{ s.staff?.name }}</span>
                                <span><i class="fas fa-map-marker-alt"></i> {{ s.room }}</span>
                            </div>
                        </div>
                        <button class="btn-delete" (click)="deleteSchedule(s._id)"><i class="fas fa-trash"></i></button>
                    </div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #0f172a;
      --accent: #3b82f6;
      --success: #10b981;
      --warning: #f59e0b;
      --surface: #ffffff;
      --background: #f1f5f9;
      --text-main: #1e293b;
      --text-muted: #64748b;
    }

    .academic-management {
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      padding-bottom: 4rem;
      max-width: 1600px;
      margin: 0 auto;
    }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* --- HERO HEADER --- */
    .welcome-header {
      margin-bottom: 3rem;
      padding: 3rem;
      background: white;
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.6);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      position: relative;
      overflow: hidden;
    }
    .welcome-header::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 6px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
    }
    
    .welcome-header h3 { 
      font-size: 2.5rem; font-weight: 800; color: var(--text-main); margin: 0; 
      letter-spacing: -1px;
    }
    .welcome-header p { 
      color: var(--text-muted); font-size: 1.1rem; margin-top: 0.5rem; max-width: 600px; 
      line-height: 1.6;
    }

    /* --- SCHEDULE EDITOR & FILTER --- */
    .filter-bar { 
      background: white; 
      padding: 1.5rem; 
      border-radius: 20px; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.02);
      border: 1px solid #f1f5f9;
      display: flex; align-items: center; gap: 2rem;
    }
    .filter-bar select {
      background: #f8fafc; border: 1px solid #e2e8f0;
      padding: 1rem 1.5rem; font-size: 1rem;
    }

    /* --- MODAL --- */
    .modal-overlay { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); }
    .modal-card { 
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
      border-radius: 28px;
    }
    .modal-header { background: white; padding: 2.5rem; border-bottom: none; }
    .modal-body { padding: 0 2.5rem 2.5rem 2.5rem; }
    
    .schedule-grid-container {
      background: white; border-radius: 24px; padding: 2rem;
      border: 1px solid #f1f5f9;
      box-shadow: 0 10px 30px rgba(0,0,0,0.02);
    }

    .time-cell { background: #f8fafc !important; border: 1px solid #e2e8f0; box-shadow: none; }

    /* --- Empty & Loading --- */
    .empty-state, .loading-state { text-align: center; padding: 5rem 0; color: var(--text-muted); }
    .empty-state i { font-size: 3rem; margin-bottom: 1.5rem; opacity: 0.3; }
    
    /* --- Grid Table & Sessions --- */
    .schedule-table { width: 100%; border-collapse: separate; border-spacing: 16px; }
    .schedule-table th { padding: 1.5rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.8rem; }
    .schedule-table td { vertical-align: top; height: 180px; }
    
    .session-cell { background: white; border: 2px dashed #e2e8f0; border-radius: 20px; transition: 0.3s; }
    .session-cell.empty:hover { border-color: var(--accent); background: #f8fafc; cursor: cell; }
    .add-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; color: #cbd5e1; font-size: 1.5rem; opacity: 0; transition: 0.3s; }
    .session-cell:hover .add-placeholder { opacity: 0.6; }

    .session-block {
      background: var(--primary); color: white; border-radius: 16px; padding: 1rem;
      height: 100%; box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      display: flex; flex-direction: column; transition: 0.3s;
      position: relative; overflow: hidden;
    }
    .session-block:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
    .session-block.cours { background: linear-gradient(135deg, #059669, #10b981); }
    .session-block.td { background: linear-gradient(135deg, #0284c7, #0ea5e9); }
    .session-block.tp { background: linear-gradient(135deg, #475569, #64748b); }

    .module-name { font-weight: 950; font-size: 1.1rem; line-height: 1.1; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }

    .session-info { 
      display: flex; flex-direction: column; gap: 0.5rem; 
      background: rgba(0,0,0,0.2); backdrop-filter: blur(8px);
      padding: 0.75rem; border-radius: 14px; margin-top: auto; border: 1px solid rgba(255,255,255,0.1);
    }
    .info-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; font-weight: 800; i { width: 18px; text-align: center; color: #fbbf24; } }

    .btn-delete-mini { position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 8px; width: 24px; height: 24px; cursor: pointer; opacity: 0; transition: 0.2s; }
    .session-block:hover .btn-delete-mini { opacity: 1; }
    .btn-delete-mini:hover { background: #ef4444; }

    .info-message { background: white; padding: 4rem; border-radius: 32px; text-align: center; border: 3px dashed #f1f5f9; i { font-size: 4rem; color: #e2e8f0; margin-bottom: 2rem; } p { color: #94a3b8; font-size: 1.2rem; font-weight: 700; margin: 0; } }

    /* --- Form Styles --- */
    .field-group { margin-bottom: 1.5rem; label { display: block; font-weight: 800; color: #475569; margin-bottom: 0.75rem; font-size: 0.9rem; i { color: #0055a4; margin-right: 0.5rem; } } input, select { width: 100%; padding: 1rem 1.25rem; border: 2px solid #f1f5f9; border-radius: 16px; background: #f8fafc; font-weight: 600; color: #0f172a; transition: all 0.3s; &:focus { outline: none; border-color: #0055a4; background: white; box-shadow: 0 0 0 4px rgba(0, 85, 164, 0.05); } } }
    .type-selector { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
    .type-btn { padding: 1rem; border: 2px solid #f1f5f9; background: white; border-radius: 16px; font-weight: 900; font-size: 0.85rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); color: #94a3b8; &.active { color: white; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); &.cours { background: #10b981; border-color: #10b981; } &.td { background: #0369a1; border-color: #0369a1; } &.tp { background: #475569; border-color: #475569; } } &:hover:not(.active) { border-color: #e2e8f0; background: #f8fafc; color: #64748b; } }
    .modal-footer { padding: 2rem 2.5rem; background: #f8fafc; display: flex; gap: 1rem; button { flex: 1; padding: 1.1rem; border-radius: 16px; font-weight: 800; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; transition: all 0.3s; } .btn-cancel { background: white; border: 2px solid #f1f5f9; color: #64748b; &:hover { border-color: #e2e8f0; color: #475569; } } .btn-save { background: #0f172a; border: none; color: white; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2); &:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(15, 23, 42, 0.3); filter: brightness(1.1); } &:disabled { opacity: 0.5; cursor: not-allowed; } } }
    .modal-header .btn-close { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; transition: all 0.2s; &:hover { color: #ef4444; } }
    .modal-header h3 { font-size: 1.5rem; font-weight: 900; color: #0f172a; margin: 0; }
    .info-banner, .error-banner { padding: 1rem 1.5rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; font-weight: 700; font-size: 0.95rem; }
    .info-banner { background: #e0f2fe; color: #0369a1; border: 1px solid rgba(3, 105, 161, 0.1); }
    .error-banner { background: #fef2f2; color: #dc2626; border: 1px solid rgba(220, 38, 38, 0.1); }
    .section-content { display: flex; flex-direction: column; gap: 2rem; }

    @media (max-width: 768px) {
      .modal-card { width: 95%; border-radius: 24px; }
      .modal-header, .modal-body, .modal-footer { padding: 1.5rem; }
      .type-selector { grid-template-columns: 1fr; }
      .btn-save, .btn-cancel { padding: 1rem; font-size: 0.9rem; }
      .schedule-grid-container { margin: 0 -1rem; border-radius: 0; padding: 0.5rem; }
      .schedule-table { min-width: 800px; border-spacing: 6px; }
    }
  `]
})
export class AdminAcademicComponent implements OnInit {
  schedules: any[] = [];
  modules: any[] = [];
  classes: any[] = [];
  subjects: any[] = [];
  staffMembers: any[] = [];

  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  types = ['Cours', 'TD', 'TP'];

  newSchedule = {
    day: 'Lundi',
    startTime: '08:30',
    endTime: '10:00',
    module: '',
    subject: '',
    classGroup: '',
    staff: '',
    room: '',
    type: 'Cours'
  };

  selectedClassFilter: string = '';

  displayModal: boolean = false;
  validationError: string = '';
  modalData = {
    day: '',
    startTime: '',
    endTime: ''
  };

  timeSlots = [
    { start: '08:30', end: '10:00', label: 'S1: 08:30 - 10:00' },
    { start: '10:10', end: '11:40', label: 'S2: 10:10 - 11:40' },
    { start: '11:50', end: '13:20', label: 'S3: 11:50 - 13:20' },
    { start: '13:30', end: '15:00', label: 'S4: 13:30 - 15:00' },
    { start: '15:10', end: '16:40', label: 'S5: 15:10 - 16:40' },
    { start: '16:40', end: '18:10', label: 'S6: 16:40 - 18:10' }
  ];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getUsers().subscribe(users => {
      this.staffMembers = users.filter(u => u.role === 'staff');
    });
    this.adminService.getModules().subscribe(m => this.modules = m);
    this.adminService.getClasses().subscribe(c => this.classes = c);
    this.adminService.getSubjects().subscribe(sub => this.subjects = sub);
    this.adminService.getSchedules().subscribe(s => {
      this.schedules = s;
    });
  }

  onClassFilterChange() {
    if (this.selectedClassFilter) {
      this.newSchedule.classGroup = this.selectedClassFilter;
    }
  }

  openModal(day: string, startTime: string, endTime: string) {
    if (!this.selectedClassFilter) {
      alert("Veuillez d'abord sélectionner une classe.");
      return;
    }

    this.modalData = { day, startTime, endTime };
    this.newSchedule.day = day;
    this.newSchedule.startTime = startTime;
    this.newSchedule.endTime = endTime;
    this.newSchedule.classGroup = this.selectedClassFilter;
    this.validationError = '';
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
    this.validationError = '';
    this.newSchedule.staff = '';
    this.newSchedule.room = '';
  }

  validateSchedule(): boolean {
    try {
      if (!this.newSchedule.classGroup || !this.newSchedule.day || !this.newSchedule.startTime) {
        return false;
      }

      const currentClassId = this.newSchedule.classGroup.toString();

      // Check for class conflict
      const classConflict = this.schedules.find(s => {
        if (!s || !s.classGroup) return false;
        const sClassId = typeof s.classGroup === 'object' ? s.classGroup._id?.toString() : s.classGroup.toString();

        return sClassId === currentClassId &&
          s.day === this.newSchedule.day &&
          s.startTime === this.newSchedule.startTime;
      });

      if (classConflict) {
        this.validationError = `La classe ${this.getClassName(this.newSchedule.classGroup)} a déjà une séance à ce créneau.`;
        return false;
      }

      // Check for room conflict
      const roomConflict = this.schedules.find(s => {
        if (!s || !s.room || !this.newSchedule.room) return false;
        return s.room.toLowerCase().trim() === this.newSchedule.room.toLowerCase().trim() &&
          s.day === this.newSchedule.day &&
          s.startTime === this.newSchedule.startTime;
      });

      if (roomConflict) {
        this.validationError = `La salle ${this.newSchedule.room} est déjà occupée à ce créneau.`;
        return false;
      }

      return true;
    } catch (e) {
      console.error('Error in validateSchedule:', e);
      this.validationError = 'Erreur lors de la validation locale.';
      return false;
    }
  }

  addSchedule() {
    try {
      if (!this.newSchedule.classGroup || !this.newSchedule.staff || !this.newSchedule.room || !this.newSchedule.subject) {
        this.validationError = 'Veuillez remplir tous les champs obligatoires.';
        return;
      }

      if (!this.validateSchedule()) {
        return;
      }

      this.adminService.createSchedule(this.newSchedule).subscribe({
        next: (res) => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => {
          if (err.status === 409) {
            this.validationError = err.error.message || 'Conflit détecté lors de la création.';
          } else {
            this.validationError = 'Erreur: ' + (err.error?.message || err.message);
          }
        }
      });
    } catch (e) {
      this.validationError = 'Une erreur inattendue est survenue.';
    }
  }

  deleteSchedule(id: string) {
    if (confirm('Supprimer cette séance ?')) {
      this.adminService.deleteSchedule(id).subscribe(() => this.loadData());
    }
  }

  getSchedulesForDay(day: string) {
    let filtered = this.schedules.filter(s => s.day === day);

    if (this.selectedClassFilter) {
      filtered = filtered.filter(s => {
        const sClassId = typeof s.classGroup === 'object' ? s.classGroup._id?.toString() : s.classGroup.toString();
        const filterId = this.selectedClassFilter.toString();
        return String(sClassId) === String(filterId);
      });
    }
    return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  getSession(day: string, slotStart: string) {
    if (!this.selectedClassFilter) return null;

    const session = this.schedules.find(s => {
      if (!s || !s.day || !s.startTime || !s.classGroup) return false;
      const sClassId = typeof s.classGroup === 'object' ? s.classGroup._id?.toString() : s.classGroup.toString();
      const filterId = this.selectedClassFilter.toString();
      return s.day === day &&
        s.startTime?.trim() === slotStart?.trim() &&
        String(sClassId) === String(filterId);
    });
    return session;
  }

  openAddModal(day: string, startTime: string, endTime: string) {
    this.openModal(day, startTime, endTime);
  }

  getClassName(id: string): string {
    const c = this.classes.find(Item => Item._id === id);
    return c ? c.name : '';
  }
}
