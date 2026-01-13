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
      </div>
    </div>
  `,
  styles: [`
    :host {
      --color-cours: #10b981;
      --color-td: #0369a1;
      --color-tp: #475569;
      --admin-navy: #0f172a;
      --admin-gold: #f59e0b;
    }

    .academic-management {
      animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      padding-bottom: 3rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .welcome-header {
      margin-bottom: 2.5rem;
      padding: 2.5rem;
      background: linear-gradient(145deg, #f8fafc 0%, #ffffff 100%);
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
      
      h3 { 
        font-size: 2.2rem; 
        font-weight: 900; 
        color: var(--admin-navy); 
        margin: 0;
        letter-spacing: -0.5px;
      }
      p { color: #64748b; font-size: 1.15rem; margin: 0.6rem 0 0; font-weight: 500; }
    }

    .tabs-container {
      background: white;
      border-radius: 28px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 20px 50px rgba(0,0,0,0.04);
    }

    .tabs { 
      display: flex; 
      background: #fbfcfe;
      border-bottom: 1px solid #f1f5f9;
      padding: 0 1.5rem;
    }

    .tab {
      padding: 1.5rem 2.5rem;
      border: none;
      background: none;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      position: relative;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      i { font-size: 1.1rem; transition: transform 0.3s; }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 4px;
        background: var(--admin-blue);
        border-radius: 4px 4px 0 0;
        transform: translateX(-50%);
        transition: all 0.3s ease;
      }

      &:hover { color: var(--admin-navy); background: rgba(14, 165, 233, 0.03); }

      &.active {
        color: var(--admin-navy);
        background: white;
        &::after { width: 50%; }
        i { color: var(--admin-blue); transform: scale(1.15); }
      }
    }

    .tab-content { padding: 3rem; min-height: 500px; }

    .schedule-editor { display: flex; flex-direction: column; gap: 2rem; }

    .filter-bar { 
      display: flex; 
      align-items: center; 
      gap: 2rem; 
      padding: 1.5rem 2.5rem; 
      background: #f8fafc; 
      border-radius: 20px; 
      border: 1px solid #e2e8f0;
      
      label { 
        font-weight: 800; 
        color: var(--admin-navy); 
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 1.05rem;
        
        i { color: var(--admin-blue); font-size: 1.2rem; } 
      } 
      
      select { 
        padding: 0.9rem 1.5rem; 
        border-radius: 14px; 
        border: 2px solid white; 
        font-weight: 700; 
        color: #1e293b; 
        min-width: 300px;
        background: white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        cursor: pointer;
        transition: all 0.2s;

        &:hover { border-color: #cbd5e1; }
        &:focus {
           border-color: var(--admin-blue);
           box-shadow: 0 0 0 5px rgba(14, 165, 233, 0.1);
           outline: none;
        }
      } 
    }

    /* --- Ultra Pro Schedule Grid --- */
    .schedule-grid-container { 
        padding: 1.5rem;
        background: #f8fafc;
        border-radius: 32px;
        box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
    }
    
    .schedule-table { 
      width: 100%; 
      border-collapse: separate; 
      border-spacing: 16px; 
    }
    
    .schedule-table th { 
        padding: 1.5rem;
        font-weight: 900; 
        color: #64748b;
        background: white;
        border-radius: 16px;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.03);
    }
    
    .schedule-table td { 
        vertical-align: top; 
        height: 200px; 
    }

    .time-cell { 
        background: white !important;
        border-radius: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.04);
        display: flex; 
        flex-direction: column; 
        align-items: center;
        justify-content: center; 
        .start { font-weight: 950; font-size: 1.3rem; color: #0f172a; }
        .end { font-weight: 700; font-size: 0.9rem; color: #94a3b8; }
    }
    
    .session-cell { 
        background: #ffffff;
        border: 2px dashed #e2e8f0;
        border-radius: 24px;
        transition: all 0.4s ease;
        
        &.empty:hover { 
            background: #f0f9ff;
            border-color: #0ea5e9;
            transform: scale(1.02);
        } 
    }
    
    .session-block { 
        height: 100%; 
        border-radius: 20px; 
        padding: 1.25rem; 
        color: #ffffff !important; 
        background: #334155; /* Neutral slate pro */
        box-shadow: 0 15px 35px -5px rgba(0,0,0,0.25); 
        display: flex; 
        flex-direction: column; 
        justify-content: flex-start;
        gap: 0.75rem;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.2);
        z-index: 5;

        &::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%);
            z-index: 1; pointer-events: none;
        }

        &:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 50px -10px rgba(0,0,0,0.4);
            filter: brightness(1.1);
        }
        
        &.cours { background: linear-gradient(135deg, #059669, #10b981) !important; } 
        &.td { background: linear-gradient(135deg, #0284c7, #0ea5e9) !important; } 
        &.tp { background: linear-gradient(135deg, #475569, #64748b) !important; } 

        .session-main { 
            position: relative; 
            z-index: 10; 
            height: 100%; 
            display: flex; 
            flex-direction: column; 
            width: 100%; 
            color: white !important;
        }
    }
    
    .module-name { 
        font-weight: 950; 
        font-size: 1.1rem; 
        line-height: 1.1;
        margin-bottom: 0.5rem;
        display: block;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        color: white !important;
    }

    .session-info { 
        display: flex; 
        flex-direction: column; 
        gap: 0.5rem; 
        background: rgba(0,0,0,0.2);
        backdrop-filter: blur(8px);
        padding: 0.75rem;
        border-radius: 14px;
        margin-top: auto;
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    .info-item { 
        display: flex; 
        align-items: center; 
        gap: 0.6rem; 
        font-size: 0.85rem;
        font-weight: 800; 
        color: white !important;
        white-space: nowrap;
        
        i { width: 18px; text-align: center; color: #fbbf24; font-size: 0.95rem; }
    }

    .btn-delete-mini { 
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.2); 
        border: 1px solid rgba(255,255,255,0.3);
        color: white; 
        width: 32px; height: 32px; 
        border-radius: 12px; 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        transition: all 0.2s;
        z-index: 20;
        opacity: 0;
        
        &:hover { background: #ef4444; border-color: transparent; } 
    }

    .session-block:hover .btn-delete-mini { opacity: 1; }

    .info-message {
      background: white;
      padding: 4rem;
      border-radius: 32px;
      text-align: center;
      border: 3px dashed #f1f5f9;
      
      i { font-size: 4rem; color: #e2e8f0; margin-bottom: 2rem; }
      p { color: #94a3b8; font-size: 1.2rem; font-weight: 700; margin: 0; }
    }

    /* --- Mobile Responsive Pro Style --- */
    @media (max-width: 768px) {
      .academic-management {
        padding-bottom: 5rem; /* Space for bottom nav if any */
      }

      .welcome-header {
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border-radius: 20px;
        
        h3 { font-size: 1.5rem; }
        p { font-size: 0.95rem; }
      }

      .tabs-container {
        border-radius: 20px;
      }

      .tabs {
        overflow-x: auto;
        white-space: nowrap;
        padding: 0 0.5rem;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; /* Hide scrollbar for cleaner look */
        
        &::-webkit-scrollbar { display: none; }
      }

      .tab {
        padding: 1.2rem 1rem;
        font-size: 0.8rem;
        flex-shrink: 0;
      }

      .tab-content {
        padding: 1.5rem;
      }

      .section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
        
        .btn-primary-gradient {
          width: 100%;
          justify-content: center;
        }
      }

      /* Stack Validation Cards */
      .validation-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        
        .card-actions {
          width: 100%;
          justify-content: space-between;
          
          .btn-action { flex: 1; justify-content: center; }
        }
      }

      /* Filter Bar Stacking */
      .filter-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        padding: 1.2rem;
        
        label { font-size: 0.95rem; }
        select { width: 100%; min-width: auto; }
      }
      
      /* Grid Container Fix */
      .schedule-grid-container {
        margin: 0 -1rem;
        border-radius: 0;
        border-right: none;
        border-left: none;
        box-shadow: none;
        padding: 0.5rem;
      }

      .schedule-table {
        border-spacing: 6px;
        min-width: 800px; /* Slightly more compact for mobile scroll */
      }

      .session-cell {
        height: 120px; /* More compact on mobile */
      }

      .module-name { font-size: 0.8rem; margin-bottom: 0.3rem; }
      .session-info { padding: 0.4rem; border-radius: 8px; }
      .info-item { font-size: 0.65rem; gap: 0.3rem; i { font-size: 0.7rem; } }

    }

    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeInOverlay 0.3s ease;
    }

    .modal-card {
      background: white;
      width: 550px;
      max-width: 95%;
      border-radius: 32px;
      box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.25);
      overflow: hidden;
      animation: slideInModal 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInModal { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

    .modal-header {
      padding: 2.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 { font-size: 1.5rem; font-weight: 900; color: #0f172a; margin: 0; }
      .btn-close { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; transition: all 0.2s; &:hover { color: #ef4444; } }
    }

    .modal-body { padding: 2.5rem; }

    .info-banner {
      background: #e0f2fe;
      color: #0369a1;
      padding: 1rem 1.5rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      font-weight: 700;
      font-size: 0.95rem;
      border: 1px solid rgba(3, 105, 161, 0.1);
    }

    .error-banner {
      background: #fef2f2;
      color: #dc2626;
      padding: 1rem 1.5rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      font-weight: 700;
      font-size: 0.9rem;
      border: 1px solid rgba(220, 38, 38, 0.1);
    }

    .field-group {
      margin-bottom: 1.5rem;
      label { display: block; font-weight: 800; color: #475569; margin-bottom: 0.75rem; font-size: 0.9rem; i { color: #0055a4; margin-right: 0.5rem; } }
      input, select {
        width: 100%;
        padding: 1rem 1.25rem;
        border: 2px solid #f1f5f9;
        border-radius: 16px;
        background: #f8fafc;
        font-weight: 600;
        color: #0f172a;
        transition: all 0.3s;
        &:focus { outline: none; border-color: #0055a4; background: white; box-shadow: 0 0 0 4px rgba(0, 85, 164, 0.05); }
      }
    }

    .type-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .type-btn {
      padding: 1rem;
      border: 2px solid #f1f5f9;
      background: white;
      border-radius: 16px;
      font-weight: 900;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      color: #94a3b8;

      &.active {
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        &.cours { background: #10b981; border-color: #10b981; }
        &.td { background: #0369a1; border-color: #0369a1; }
        &.tp { background: #475569; border-color: #475569; }
      }
      &:hover:not(.active) { border-color: #e2e8f0; background: #f8fafc; color: #64748b; }
    }

    .modal-footer {
      padding: 2rem 2.5rem;
      background: #f8fafc;
      display: flex;
      gap: 1rem;
      
      button {
        flex: 1;
        padding: 1.1rem;
        border-radius: 16px;
        font-weight: 800;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-cancel { background: white; border: 2px solid #f1f5f9; color: #64748b; &:hover { border-color: #e2e8f0; color: #475569; } }
      .btn-save { 
        background: #0f172a; 
        border: none; 
        color: white; 
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
        &:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(15, 23, 42, 0.3); filter: brightness(1.1); }
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      }
    }

    @media (max-width: 768px) {
      .modal-card { width: 95%; border-radius: 24px; }
      .modal-header, .modal-body, .modal-footer { padding: 1.5rem; }
      .type-selector { grid-template-columns: 1fr; }
      .btn-save, .btn-cancel { padding: 1rem; font-size: 0.9rem; }
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
