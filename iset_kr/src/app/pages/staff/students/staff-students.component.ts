import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../services/staff.service';

@Component({
  selector: 'app-staff-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="students-management">
      <!-- CONTROL HEADER -->
      <div class="control-header glass-card">
        <div class="header-main">
          <div class="title-wrap">
            <h2>Mes Étudiants</h2>
            <p>Consultez les profils et les listes par groupe de votre département.</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" (click)="exportList()">
              <i class="fas fa-file-excel"></i> Exporter Liste
            </button>
          </div>
        </div>
        
        <div class="filters-row">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (input)="filterStudents()" 
                   placeholder="Rechercher par nom ou matricule...">
          </div>
          <div class="select-group">
            <select class="glass-select" [(ngModel)]="selectedClass" (change)="loadStudents()">
              <option value="all">Toutes les classes</option>
              <option *ngFor="let g of groups" [value]="g._id">{{ g.name }}</option>
            </select>
            <select class="glass-select" [(ngModel)]="selectedSpecialty" (change)="filterStudents()">
              <option value="all">Toutes spécialités</option>
              <option value="Informatique">Génie Informatique</option>
              <option value="Réseaux">Réseaux & Télécoms</option>
            </select>
          </div>
        </div>
      </div>

      <!-- STUDENTS GRID/TABLE -->
      <div class="students-content glass-card">
        <div class="loading-state" *ngIf="loading">
          <i class="fas fa-circle-notch fa-spin"></i>
          <p>Chargement des étudiants...</p>
        </div>

        <div class="table-responsive" *ngIf="!loading">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom & Prénom</th>
                <th>Matricule</th>
                <th>Département</th>
                <th>Classe</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of filteredStudents; let i = index" class="student-row">
                <td>
                  <div class="student-avatar" [style.background-image]="'url(' + student.photo + ')'" *ngIf="student.photo"></div>
                  <div class="student-avatar-placeholder" *ngIf="!student.photo">
                    {{ student.name.charAt(0) }}
                  </div>
                </td>
                <td>
                  <div class="name-cell">
                    <span class="full-name">{{ student.name }}</span>
                    <span class="email">{{ student.email }}</span>
                  </div>
                </td>
                <td><span class="matricule-tag">{{ student.matricule }}</span></td>
                <td>{{ student.department?.name || 'Inconnu' }}</td>
                <td><span class="class-badge">{{ student.classGroup?.name || 'N/A' }}</span></td>
                <td class="actions-cell">
                  <button class="action-btn" (click)="viewProfile(student)" title="Voir profil">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="action-btn" (click)="messageStudent(student)" title="Envoyer message">
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="empty-state" *ngIf="filteredStudents.length === 0">
            <i class="fas fa-user-slash"></i>
            <h3>Aucun étudiant trouvé</h3>
            <p>Essayez d'ajuster vos filtres de recherche.</p>
          </div>
        </div>
      </div>

      <!-- STUDENT DETAIL MODAL -->
      <div class="modal-overlay" *ngIf="selectedStudent" (click)="closeProfile()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closeProfile()"><i class="fas fa-times"></i></button>
          
          <div class="modal-header-profile">
            <div class="profile-big-avatar">
              <span *ngIf="!selectedStudent.photo">{{ selectedStudent.name.charAt(0) }}</span>
              <img *ngIf="selectedStudent.photo" [src]="selectedStudent.photo" alt="avatar">
            </div>
            <h2>{{ selectedStudent.name }}</h2>
            <p class="role-badge">Étudiant</p>
          </div>

          <div class="modal-body-grid">
            <div class="info-item">
              <label>Matricule</label>
              <span>{{ selectedStudent.matricule }}</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>{{ selectedStudent.email }}</span>
            </div>
            <div class="info-item">
              <label>Téléphone</label>
              <span>{{ selectedStudent.phone || 'Non renseigné' }}</span>
            </div>
            <div class="info-item">
              <label>CIN</label>
              <span>{{ selectedStudent.cin || 'Non renseigné' }}</span>
            </div>
            <div class="info-item">
              <label>Date de Naissance</label>
              <span>{{ selectedStudent.birthDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <label>Genre</label>
              <span>{{ selectedStudent.gender || 'Non renseigné' }}</span>
            </div>
            <div class="info-item full">
              <label>Département</label>
              <span>{{ selectedStudent.department?.name || 'Non assigné' }}</span>
            </div>
             <div class="info-item full">
              <label>Classe</label>
              <span>{{ selectedStudent.classGroup?.name || 'Non assigné' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .students-management { display: flex; flex-direction: column; gap: 2rem; animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 24px; padding: 2rem; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03); }
    .header-main { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; } p { color: #64748b; font-weight: 500; } .btn-primary { background: #0055a4; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; transition: all 0.3s; &:hover { background: #003e7a; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 85, 164, 0.2); } } }
    .filters-row { display: flex; gap: 1.5rem; flex-wrap: wrap; .search-box { position: relative; flex: 1; min-width: 300px; i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; } input { width: 100%; background: #f1f5f9; border: 1px solid transparent; padding: 0.8rem 1rem 0.8rem 3rem; border-radius: 14px; font-family: inherit; font-weight: 600; transition: all 0.3s; &:focus { outline: none; border-color: #0055a4; background: white; box-shadow: 0 0 0 4px rgba(0, 85, 164, 0.1); } } } .select-group { display: flex; gap: 1rem; } .glass-select { background: #f1f5f9; border: 1px solid transparent; padding: 0.8rem 1.2rem; border-radius: 14px; font-family: inherit; font-weight: 700; color: #0f172a; cursor: pointer; &:focus { outline: none; border-color: #0055a4; } } }
    .premium-table { width: 100%; border-collapse: separate; border-spacing: 0 0.8rem; th { padding: 1rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; } .student-row { background: white; transition: all 0.3s; td { padding: 1.2rem 1.5rem; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; vertical-align: middle; &:first-child { border-left: 1px solid #f1f5f9; border-radius: 16px 0 0 16px; } &:last-child { border-right: 1px solid #f1f5f9; border-radius: 0 16px 16px 0; } } &:hover { transform: scale(1.01); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05); td { border-color: #0055a4; background: #f0f7ff; } } } .student-avatar, .student-avatar-placeholder { width: 45px; height: 45px; border-radius: 12px; background-size: cover; background-position: center; } .student-avatar-placeholder { background: linear-gradient(135deg, #0055a4, #0077c8); color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; } .name-cell { display: flex; flex-direction: column; .full-name { font-weight: 800; color: #0f172a; font-size: 1rem; } .email { font-size: 0.8rem; color: #64748b; font-weight: 500; } } .matricule-tag { background: #f1f5f9; padding: 0.4rem 0.8rem; border-radius: 10px; font-size: 0.8rem; font-weight: 900; color: #0055a4; font-family: monospace; } .specialty-badge { font-weight: 700; color: #d97706; background: #fffbeb; padding: 0.3rem 0.8rem; border-radius: 8px; font-size: 0.8rem; } .class-badge { font-weight: 700; color: #0055a4; background: #eff6ff; padding: 0.3rem 0.8rem; border-radius: 8px; font-size: 0.8rem; } .action-btn { background: white; border: 1px solid #e2e8f0; width: 38px; height: 38px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; margin-right: 0.5rem; cursor: pointer; transition: all 0.3s; color: #64748b; &:hover { background: #0055a4; color: white; border-color: #0055a4; transform: translateY(-2px); } } }
    .empty-state { padding: 5rem 2rem; text-align: center; i { font-size: 4rem; color: #f1f5f9; margin-bottom: 2rem; display: block; } h3 { font-size: 1.5rem; color: #0f172a; margin-bottom: 0.5rem; } p { color: #64748b; font-weight: 500; } }
    .loading-state { padding: 4rem; text-align: center; color: #64748b; i { font-size: 2.5rem; margin-bottom: 1rem; color: #cbd5e1; } }
    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
    .modal-card { background: white; width: 90%; max-width: 600px; border-radius: 20px; padding: 2rem; position: relative; animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
    .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; color: #64748b; cursor: pointer; transition: 0.2s; &:hover { background: #e2e8f0; color: #ef4444; } }
    .modal-header-profile { text-align: center; margin-bottom: 2rem; .profile-big-avatar { width: 100px; height: 100px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #0055a4, #0077c8); border-radius: 25px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: 900; img { width: 100%; height: 100%; object-fit: cover; border-radius: 25px; } } h2 { color: #0f172a; font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; } .role-badge { display: inline-block; background: #eff6ff; color: #0055a4; padding: 0.3rem 0.8rem; border-radius: 8px; font-weight: 700; font-size: 0.8rem; } }
    .modal-body-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; .info-item { display: flex; flex-direction: column; gap: 0.3rem; label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 800; } span { font-weight: 600; color: #334155; font-size: 1rem; } &.full { grid-column: span 2; } } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class StaffStudentsComponent implements OnInit {
  searchTerm: string = '';
  selectedClass: string = 'all';
  selectedSpecialty: string = 'all';
  loading = false;

  students: any[] = [];
  filteredStudents: any[] = [];
  groups: any[] = [];

  constructor(private staffService: StaffService) { }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadStudents();
  }

  loadInitialData() {
    // Mocked for now
    this.groups = [
      { _id: 'g1', name: 'DSI 3.1' },
      { _id: 'g2', name: 'DSI 3.2' },
      { _id: 'g3', name: 'RSI 2.1' }
    ];
  }

  loadStudents() {
    this.loading = true;
    this.staffService.getStudents(this.selectedClass !== 'all' ? this.selectedClass : undefined).subscribe({
      next: (data) => {
        this.students = data;
        this.filterStudents();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading students', err);
        this.loading = false;
      }
    });
  }

  filterStudents() {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(term) || s.matricule.includes(term);
      const matchSpec = this.selectedSpecialty === 'all' || (s.specialty && s.specialty === this.selectedSpecialty);
      return matchSearch && matchSpec;
    });
  }

  viewProfile(student: any) { this.selectedStudent = student; }
  closeProfile() { this.selectedStudent = null; }
  messageStudent(student: any) { alert(`Start chat with ${student.name}`); }
  exportList() { alert('Exporting student list...'); }

  selectedStudent: any = null;
}

