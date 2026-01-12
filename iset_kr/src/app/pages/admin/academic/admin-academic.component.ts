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
          <p>Gestion centrale des notes, examens et emplois du temps.</p>
        </div>
      </div>

      <div class="tabs-container shadow-pro">
        <div class="tabs">
          <button class="tab" [class.active]="activeSection === 'grades'" (click)="activeSection = 'grades'">
            <i class="fas fa-marker"></i> Gestion des Notes
          </button>
          <button class="tab" [class.active]="activeSection === 'exams'" (click)="activeSection = 'exams'">
            <i class="fas fa-file-signature"></i> Examens & DS
          </button>
          <button class="tab" [class.active]="activeSection === 'schedule'" (click)="activeSection = 'schedule'">
            <i class="fas fa-calendar-week"></i> Emploi du temps
          </button>
        </div>

        <div class="tab-content custom-scrollbar">
          <div *ngIf="activeSection === 'grades'">
            <div class="section-header">
              <div class="info-block">
                <h4>Validation des Résultats</h4>
                <p>Nouveaux modules en attente de validation finale.</p>
              </div>
              <button class="btn-primary-gradient"><i class="fas fa-check-double"></i> Tout Valider</button>
            </div>

            <div class="validation-grid">
               <div class="validation-card" *ngFor="let item of modulesToValidate">
                  <div class="card-left">
                     <div class="module-icon"><i class="fas fa-book-open"></i></div>
                     <div class="module-info">
                        <strong>{{ item.module }}</strong>
                        <span>Responsable: {{ item.chef }}</span>
                     </div>
                  </div>
                  <div class="card-actions">
                     <button class="btn-action view"><i class="fas fa-eye"></i> Inspecter</button>
                     <button class="btn-action publish"><i class="fas fa-bullhorn"></i> Publier</button>
                  </div>
               </div>
            </div>
          </div>

          <div *ngIf="activeSection === 'exams'" class="empty-state">
            <div class="icon-wrap"><i class="fas fa-clock"></i></div>
            <h4>Calendrier en cours de préparation</h4>
            <p>La planification pour la prochaine session démarrera sous peu.</p>
          </div>

          <div *ngIf="activeSection === 'schedule'">
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
                                    (click)="!getSession(day, slot.start) ? openAddModal(day, slot.start, slot.end) : null">
                                    
                                    <div *ngIf="getSession(day, slot.start) as session" class="session-block" [ngClass]="session.type.toLowerCase()">
                                        <div class="session-main">
                                            <span class="module-name">{{ session.subject?.name || 'Matière' }}</span>
                                            <div class="session-info">
                                                <span class="info-item"><i class="fas fa-chalkboard-teacher"></i> {{ session.staff?.name }}</span>
                                                <span class="info-item"><i class="fas fa-door-open"></i> {{ session.room }}</span>
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
      </div>
    </div>
  `,
  styles: [`
    :host {
      --admin-navy: #0f172a;
      --admin-gold: #f59e0b;
      --admin-blue: #0055a4;
      --admin-accent: #3b82f6;
      --glass-bg: rgba(255, 255, 255, 0.8);
      --glass-border: rgba(255, 255, 255, 0.2);
    }

    .academic-management {
      animation: fadeIn 0.5s ease-out;
      padding-bottom: 2rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .welcome-header {
      margin-bottom: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      
      h3 { font-size: 2rem; font-weight: 900; color: var(--admin-navy); margin: 0; }
      p { color: #64748b; font-size: 1.1rem; margin: 0.5rem 0 0; font-weight: 500; }
    }

    .tabs-container {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid var(--glass-border);
      box-shadow: 0 10px 40px rgba(0,0,0,0.05);
    }

    .tabs { 
      display: flex; 
      background: rgba(248, 250, 252, 0.5);
      border-bottom: 1px solid #f1f5f9;
      padding: 0 1rem;
    }

    .tab {
      padding: 1.25rem 2rem;
      border: none;
      background: none;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      i { font-size: 1rem; }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 20%;
        width: 0;
        height: 3px;
        background: var(--admin-blue);
        border-radius: 3px 3px 0 0;
        transition: all 0.3s ease;
      }

      &:hover { color: var(--admin-blue); background: rgba(0, 85, 164, 0.05); }

      &.active {
        color: var(--admin-blue);
        &::after { width: 60%; }
        i { color: var(--admin-gold); transform: scale(1.1); }
      }
    }

    .tab-content { padding: 2.5rem; min-height: 450px; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h4 { font-size: 1.5rem; font-weight: 800; color: var(--admin-navy); margin: 0; }
      p { color: #64748b; margin-top: 0.4rem; font-weight: 500; }
    }

    /* Grid View Refinements */
    .schedule-editor { display: flex; flex-direction: column; gap: 1.5rem; }

    .filter-bar { 
      display: flex; 
      align-items: center; 
      gap: 1.5rem; 
      padding: 1.25rem 2rem; 
      background: white; 
      border-radius: 16px; 
      border: 1px solid #e2e8f0; 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      
      label { 
        font-weight: 800; 
        color: var(--admin-navy); 
        display: flex;
        align-items: center;
        gap: 0.75rem;
        
        i { color: var(--admin-blue); font-size: 1.1rem; } 
      } 
      
      select { 
        padding: 0.75rem 1.25rem; 
        border-radius: 12px; 
        border: 2px solid #f1f5f9; 
        font-weight: 700; 
        color: #334155; 
        min-width: 250px;
        background: #f8fafc;
        cursor: pointer;
        transition: all 0.2s;

        &:focus {
           border-color: var(--admin-blue);
           background: white;
           box-shadow: 0 0 0 4px rgba(0, 85, 164, 0.1);
        }
      } 
    }

    .schedule-grid-container { 
        overflow-x: auto; 
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        border: 1px solid #e2e8f0;
        margin-top: 0.5rem;
    }
    
    .schedule-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 1000px; }
    
    .schedule-table th { 
        padding: 1.5rem 1rem; 
        text-align: center; 
        font-weight: 900; 
        color: #1e293b; 
        border-bottom: 2px solid #f1f5f9; 
        background: #f8fafc; 
        position: sticky;
        top: 0;
        z-index: 10;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
    }
    
    .schedule-table td { 
        border-bottom: 1px solid #f8fafc; 
        border-right: 1px solid #f8fafc;
        vertical-align: top; 
        height: 160px; 
        width: calc((100% - 120px) / 6);
        transition: all 0.3s ease; 
        position: relative;
    }

    .time-col { width: 120px; border-right: 2px solid #f1f5f9 !important; background: #fbfcfe !important; }

    .time-cell { 
        text-align: center; 
        padding: 1.5rem 0.5rem; 
        display: flex; 
        flex-direction: column; 
        align-items: center;
        justify-content: center; 
        height: 100%;
        
        .start { font-weight: 900; font-size: 1.1rem; color: var(--admin-navy); margin-bottom: 0.25rem; }
        .end { font-weight: 600; font-size: 0.8rem; color: #94a3b8; }
    }
    
    .session-cell { 
        padding: 0.75rem; 
        &.empty:hover { 
            background: rgba(0, 85, 164, 0.02); 
            cursor: pointer; 
            .add-placeholder { opacity: 1; transform: translate(-50%, -50%) scale(1); } 
        } 
    }
    
    .add-placeholder { 
        opacity: 0; 
        position: absolute; 
        top: 50%; left: 50%; 
        transform: translate(-50%, -50%) scale(0.8);
        width: 40px; height: 40px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: var(--admin-blue); 
        font-size: 1.25rem; 
        background: white;
        border-radius: 50%;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: none; 
    }
    
    .session-block { 
        height: 100%; 
        border-radius: 14px; 
        padding: 1rem; 
        color: white; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.12); 
        display: flex; 
        flex-direction: column; 
        justify-content: space-between;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.1);
        background: #64748b; /* Default fallback */

        &::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%);
            z-index: 1;
        }

        &:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 25px rgba(0,0,0,0.2);
            z-index: 5;
            .btn-delete-mini { opacity: 1; }
        }
        
        &.cours { 
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
            border-left: 6px solid var(--admin-gold); 
        } 
        &.td { 
            background: linear-gradient(135deg, #334155 0%, #475569 100%); 
            border-left: 6px solid #94a3b8; 
        } 
        &.tp { 
            background: linear-gradient(135deg, #065f46 0%, #10b981 100%); 
            border-left: 6px solid #fcd34d; 
        } 

        .session-main { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
    }
    
    .module-name { 
        font-weight: 800; 
        font-size: 0.9rem; 
        line-height: 1.3;
        margin-bottom: 0.5rem;
        display: block;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }

    .session-info { 
        display: flex; 
        flex-direction: column; 
        gap: 0.4rem; 
        background: rgba(0,0,0,0.15);
        padding: 0.6rem;
        border-radius: 8px;
        margin-top: auto;
    }
    
    .info-item { 
        display: flex; 
        align-items: center; 
        gap: 0.5rem; 
        font-size: 0.75rem;
        font-weight: 600; 
        color: rgba(255,255,255,0.95);
        
        i { width: 14px; text-align: center; color: var(--admin-gold); font-size: 0.7rem; }
    }

    .btn-delete-mini { 
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(220, 38, 38, 0.9); 
        border: none; 
        color: white; 
        width: 24px; 
        height: 24px; 
        border-radius: 8px; 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 0.75rem; 
        transition: all 0.2s;
        opacity: 0;
        z-index: 10;
        
        &:hover { background: #b91c1c; transform: scale(1.1); } 
    }

    /* Message styles */
    .info-message {
      background: #f8fafc;
      padding: 3rem;
      border-radius: 20px;
      text-align: center;
      border: 2px dashed #e2e8f0;
      
      i { font-size: 3rem; color: #cbd5e1; margin-bottom: 1.5rem; }
      p { color: #64748b; font-size: 1.1rem; font-weight: 600; margin: 0; }
    }
  `]
})
export class AdminAcademicComponent implements OnInit {
  activeSection = 'schedule'; // Default to schedule for now
  modulesToValidate = [
    { module: 'Développement Web (DSI2)', chef: 'M. Ali' },
    { module: 'Base de Données (DSI3)', chef: 'Mme. Salma' }
  ];

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
    // Auto-fill the add form with the selected class
    if (this.selectedClassFilter) {
      this.newSchedule.classGroup = this.selectedClassFilter;
    }
  }

  openModal(day: string, startTime: string, endTime: string) {
    if (!this.selectedClassFilter) {
      alert('Veuillez d\'abord sélectionner une classe.');
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
    console.log('Attempting to add schedule:', this.newSchedule);
    try {
      if (!this.newSchedule.classGroup || !this.newSchedule.staff || !this.newSchedule.room || !this.newSchedule.subject) {
        console.warn('Missing required fields:', this.newSchedule);
        this.validationError = 'Veuillez remplir tous les champs obligatoires.';
        return;
      }

      // Validate before sending to server
      if (!this.validateSchedule()) {
        console.warn('Frontend validation failed:', this.validationError);
        return;
      }

      console.log('Sending request to server...');
      this.adminService.createSchedule(this.newSchedule).subscribe({
        next: (res) => {
          console.log('Schedule created successfully:', res);
          this.loadData();
          this.closeModal();
        },
        error: (err) => {
          console.error('Server error creating schedule:', err);
          if (err.status === 409) {
            this.validationError = err.error.message || 'Conflit détecté lors de la création.';
          } else {
            this.validationError = 'Erreur lors de la création de la séance: ' + (err.error?.message || err.message);
          }
        }
      });
    } catch (e) {
      console.error('Runtime error in addSchedule:', e);
      this.validationError = 'Une erreur inattendue est survenue.';
    }
  }

  deleteSchedule(id: string) {
    if (confirm('Supprimer cette séance ?')) {
      this.adminService.deleteSchedule(id).subscribe(() => this.loadData());
    }
  }

  // Helper for List View (legacy support)
  getSchedulesForDay(day: string) {
    let filtered = this.schedules.filter(s => s.day === day);

    if (this.selectedClassFilter) {
      filtered = filtered.filter(s => {
        // Check if classGroup is an object (populated) or string ID
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

  // Quick add from grid - now opens modal
  openAddModal(day: string, startTime: string, endTime: string) {
    this.openModal(day, startTime, endTime);
  }

  getClassName(id: string): string {
    const c = this.classes.find(Item => Item._id === id);
    return c ? c.name : '';
  }
}
