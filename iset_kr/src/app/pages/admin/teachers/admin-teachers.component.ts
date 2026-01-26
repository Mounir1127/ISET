import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-admin-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-teachers p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">Gestion des Enseignants</h2>
          <p class="text-muted small mb-0">Modifiez ou gérez le personnel enseignant de l'institut.</p>
        </div>
        <button class="btn btn-add-premium" (click)="openAddModal()">
          <i class="fas fa-plus me-2"></i> AJOUTER UN ENSEIGNANT
        </button>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="secondary-bg-light">
              <tr>
                <th class="ps-4">Enseignant</th>
                <th>Département</th>
                <th>Grade</th>
                <th>Status</th>
                <th class="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let teacher of teachers">
                <td class="ps-4">
                  <div class="d-flex align-items-center">
                    <img [src]="dataService.getImageUrl(teacher.profileImage, teacher.name)" 
                         class="rounded-circle me-3 border shadow-sm profile-thumb" width="45" height="45">
                    <div>
                      <div class="fw-bold text-dark">{{ teacher.name }}</div>
                      <div class="small text-muted">{{ teacher.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-soft-primary text-primary border-primary-soft px-3 py-2">
                    {{ teacher.department?.name || 'Inconnu' }}
                  </span>
                </td>
                <td><span class="text-secondary small fw-medium">{{ teacher.grade }}</span></td>
                <td>
                  <span class="badge rounded-pill px-3" 
                        [ngClass]="teacher.status === 'active' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'">
                    {{ teacher.status === 'active' ? 'Actif' : 'En attente' }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <button class="btn btn-icon btn-light me-2 hover-primary" (click)="editTeacher(teacher)" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-icon btn-light text-danger hover-danger" (click)="deleteTeacher(teacher._id)" title="Supprimer">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="teachers.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="fas fa-user-tie fa-3x mb-3 opacity-25"></i>
                  <p>Aucun enseignant trouvé.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Full Edit Modal -->
    <div *ngIf="showModal" class="modal-backdrop fade show"></div>
    <div *ngIf="showModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header bg-primary text-white p-4 border-0">
            <h5 class="modal-title fw-bold">{{ isEditMode ? 'Modifier le Profil Enseignant' : 'Ajouter un Enseignant' }}</h5>
            <button type="button" class="btn-close btn-close-white" (click)="closeModal()"></button>
          </div>
          <div class="modal-body p-0">
            <div class="row g-0">
              <!-- Left Side: Image & Status -->
              <div class="col-md-4 bg-light p-4 text-center border-end">
                <div class="position-relative d-inline-block mb-4">
                  <img [src]="imagePreview || dataService.getImageUrl(currentTeacher.profileImage, currentTeacher.name)" 
                       class="rounded-circle border shadow-sm profile-upload-preview" width="150" height="150">
                  <label for="imageUpload" class="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow">
                    <i class="fas fa-camera"></i>
                  </label>
                  <input type="file" id="imageUpload" class="d-none" accept="image/*" (change)="onFileSelected($event)">
                </div>
                
                <div class="mb-3 text-start">
                  <label class="form-label small text-muted text-uppercase fw-bold">Statut du Compte</label>
                  <select class="form-select border-0 shadow-sm rounded-3" name="status" [(ngModel)]="currentTeacher.status">
                    <option value="active">Actif</option>
                    <option value="pending">En attente</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
                
                <div class="text-start">
                  <label class="form-label small text-muted text-uppercase fw-bold">Rôle</label>
                  <select class="form-select border-0 shadow-sm rounded-3" name="role" [(ngModel)]="currentTeacher.role">
                    <option value="staff">Enseignant</option>
                    <option value="chef">Chef de Dépt</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>

              <!-- Right Side: Form Fields -->
              <div class="col-md-8 p-4">
                <form #editForm="ngForm">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label small text-muted text-uppercase fw-bold">Nom Complet</label>
                      <input type="text" class="form-control" name="name" [(ngModel)]="currentTeacher.name" required>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small text-muted text-uppercase fw-bold">Email</label>
                      <input type="email" class="form-control" [class.bg-light]="isEditMode" name="email" [(ngModel)]="currentTeacher.email" [disabled]="isEditMode" required>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label small text-muted text-uppercase fw-bold">Matricule</label>
                      <input type="text" class="form-control" name="matricule" [(ngModel)]="currentTeacher.matricule">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small text-muted text-uppercase fw-bold">CIN</label>
                      <input type="text" class="form-control" name="cin" [(ngModel)]="currentTeacher.cin">
                    </div>

                    <div class="col-md-6">
                      <label class="form-label small text-muted text-uppercase fw-bold">Portable</label>
                      <input type="text" class="form-control" name="phone" [(ngModel)]="currentTeacher.phone">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small text-muted text-uppercase fw-bold">Date de Naissance</label>
                      <input type="date" class="form-control" name="birthDate" [ngModel]="formatDate(currentTeacher.birthDate)" (ngModelChange)="currentTeacher.birthDate=$event">
                    </div>

                    <div class="col-md-6">
                      <label class="form-label small text-muted text-uppercase fw-bold">Département</label>
                      <select class="form-select" name="department" [(ngModel)]="currentTeacher.department">
                        <option *ngFor="let dept of departments" [value]="dept._id">{{ dept.name }}</option>
                        <option value="">Aucun</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small text-muted text-uppercase fw-bold">Grade</label>
                      <select class="form-select" name="grade" [(ngModel)]="currentTeacher.grade">
                        <option value="Maître de Conférences">Maître de Conférences</option>
                        <option value="Maître Assistant">Maître Assistant</option>
                        <option value="Assistant">Assistant</option>
                        <option value="PES">PES</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    <div class="col-12">
                      <label class="form-label small text-muted text-uppercase fw-bold">Spécialité</label>
                      <input type="text" class="form-control" name="speciality" [(ngModel)]="currentTeacher.speciality">
                    </div>

                    <div class="col-12">
                      <label class="form-label small text-muted text-uppercase fw-bold">Bio / Présentation</label>
                      <textarea class="form-control" name="bio" [(ngModel)]="currentTeacher.bio" rows="3"></textarea>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button type="button" class="btn btn-light px-4" (click)="closeModal()">Annuler</button>
                    <button type="button" class="btn btn-primary px-4 fw-bold shadow-sm" (click)="saveChanges()" [disabled]="isLoading || !editForm.valid">
                      <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ isLoading ? "Enregistrement..." : (isEditMode ? "Enregistrer les modifications" : "Créer l'enseignant") }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rounded-4 { border-radius: 1rem !important; }
    .bg-soft-primary { background-color: rgba(59, 130, 246, 0.08); }
    .bg-success-soft { background-color: rgba(16, 185, 129, 0.1); }
    .bg-warning-soft { background-color: rgba(245, 158, 11, 0.1); }
    .border-primary-soft { border: 1px solid rgba(59, 130, 246, 0.2); }
    .profile-thumb { object-fit: cover; }
    .profile-upload-preview { object-fit: cover; background: #fff; }
    .btn-icon { width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; }
    .hover-primary:hover { background-color: #3b82f6 !important; color: white !important; }
    .hover-danger:hover { background-color: #ef4444 !important; color: white !important; }
    .modal-backdrop { background: rgba(0, 8, 20, 0.6); backdrop-filter: blur(4px); }
    .form-control, .form-select { border-color: #e2e8f0; border-radius: 0.5rem; padding: 0.6rem 0.75rem; font-size: 0.9rem; }
    .form-control:focus, .form-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    
    .btn-add-premium {
      background: linear-gradient(135deg, #002d72 0%, #001b44 100%);
      color: white;
      border: none;
      padding: 0.8rem 2rem;
      border-radius: 50px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0, 45, 114, 0.3);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .btn-add-premium:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 25px rgba(0, 45, 114, 0.4);
      color: #fff;
    }
    .btn-add-premium:active {
      transform: translateY(0);
    }
  `]
})
export class AdminTeachersComponent implements OnInit {
  teachers: any[] = [];
  departments: any[] = [];
  showModal = false;
  currentTeacher: any = {};
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  isEditMode = false;

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadDepartments();
  }

  loadUsers(): void {
    this.dataService.getAdminUsers().subscribe({
      next: (users) => this.teachers = users.filter((u: any) => u.role === 'staff' || u.role === 'chef'),
      error: (err) => console.error('Error loading users:', err)
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentTeacher = {
      role: 'staff',
      status: 'active',
      department: '',
      grade: 'Assistant'
    };
    this.imagePreview = null;
    this.selectedFile = null;
    this.showModal = true;
  }

  loadDepartments(): void {
    this.dataService.getPartners().subscribe(); // Side effect context
    fetch(`${this.dataService['apiUrl']}/public/departments`)
      .then(res => res.json())
      .then(depts => this.departments = depts)
      .catch(err => console.error('Error loading departments:', err));
  }

  formatDate(dateStr: any): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  editTeacher(teacher: any): void {
    this.isEditMode = true;
    // Flatten department if it's an object
    const deptId = teacher.department?._id || teacher.department;
    this.currentTeacher = { ...teacher, department: deptId };
    this.imagePreview = null;
    this.selectedFile = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentTeacher = {};
    this.imagePreview = null;
    this.selectedFile = null;
  }

  saveChanges(): void {
    if (!this.isEditMode && (!this.currentTeacher.email || !this.currentTeacher.name)) return;
    if (this.isEditMode && !this.currentTeacher._id) return;

    this.isLoading = true;

    // 1. If image selected, upload it FIRST if we are editing
    // If adding, we'll create the user first, then upload if needed
    if (this.isEditMode && this.selectedFile) {
      this.dataService.uploadProfileImage(this.currentTeacher._id, this.selectedFile).subscribe({
        next: (user) => {
          this.currentTeacher.profileImage = user.profileImage;
          this.performUpdate();
        },
        error: (err) => {
          this.isLoading = false;
          alert('Erreur lors de l\'upload de l\'image');
        }
      });
    } else if (this.isEditMode) {
      this.performUpdate();
    } else {
      this.performCreate();
    }
  }

  private performCreate(): void {
    this.dataService.createAdminUser(this.currentTeacher).subscribe({
      next: (newUser) => {
        // If there's an image, upload it now
        if (this.selectedFile) {
          this.dataService.uploadProfileImage(newUser._id, this.selectedFile).subscribe({
            next: (updatedUser) => {
              this.teachers.unshift(updatedUser);
              this.finishSave();
            },
            error: () => {
              this.teachers.unshift(newUser);
              this.finishSave();
              alert('Utilisateur créé, mais erreur lors de l\'upload de l\'image.');
            }
          });
        } else {
          this.teachers.unshift(newUser);
          this.finishSave();
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert('Erreur lors de la création: ' + (err.error?.message || err.message));
      }
    });
  }

  private finishSave(): void {
    this.isLoading = false;
    this.closeModal();
  }

  private performUpdate(): void {
    this.dataService.updateUser(this.currentTeacher._id, this.currentTeacher).subscribe({
      next: (updated) => {
        this.isLoading = false;
        const index = this.teachers.findIndex(t => t._id === updated._id);
        if (index !== -1) this.teachers[index] = updated;
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        alert('Erreur: ' + (err.error?.message || err.message));
      }
    });
  }

  deleteTeacher(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      this.dataService.deleteUser(id).subscribe({
        next: () => this.teachers = this.teachers.filter(t => t._id !== id),
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }
}
