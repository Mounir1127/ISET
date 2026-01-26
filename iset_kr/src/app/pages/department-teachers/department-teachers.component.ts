import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-department-teachers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="teachers-page py-10">
      <div class="container">
        <div class="mb-8">
          <a [routerLink]="['/departement', deptId]" class="btn btn-link text-navy ps-0">
            <i class="fas fa-arrow-left me-2"></i> Retour au département
          </a>
          <h1 class="display-4 fw-black text-navy mt-3">Notre Corps Enseignant</h1>
          <p class="lead text-muted">L'excellence académique au service de votre réussite.</p>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-3" *ngFor="let teacher of teachers">
            <div class="teacher-card shadow-sm h-100">
              <div class="card-img-top-wrapper">
                <img [src]="dataService.getImageUrl(teacher.profileImage, teacher.name)" 
                     [alt]="teacher.name" 
                     class="card-img-top">
              </div>
              <div class="card-body text-center p-4">
                <h5 class="card-title fw-bold text-navy mb-1">{{ teacher.name }}</h5>
                <p class="card-text text-gold fw-bold small mb-2">{{ teacher.grade }}</p>
                <p class="card-text text-muted small mb-3">{{ teacher.speciality }}</p>
                <a [routerLink]="['/enseignant', teacher._id]" class="btn btn-outline-navy btn-sm rounded-pill px-4">
                  Voir Profil
                </a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="teachers.length === 0" class="text-center py-10">
          <i class="fas fa-user-slash display-1 text-light mb-4"></i>
          <h3 class="text-muted">Aucun enseignant trouvé pour ce département</h3>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .teachers-page {
      background: #f8fafc;
      min-height: 80vh;
    }
    .text-navy { color: #001b44; }
    .text-gold { color: #c5a021; }
    .btn-outline-navy {
      color: #001b44;
      border-color: #001b44;
      &:hover {
        background: #001b44;
        color: white;
      }
    }
    .teacher-card {
      border: none;
      border-radius: 20px;
      overflow: hidden;
      transition: transform 0.3s ease;
      background: white;
      &:hover {
        transform: translateY(-10px);
      }
    }
    .card-img-top-wrapper {
      height: 250px;
      overflow: hidden;
    }
    .card-img-top {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .fw-black { font-weight: 900; }
  `]
})
export class DepartmentTeachersComponent implements OnInit {
  deptId: string | null = null;
  teachers: any[] = [];

  constructor(private route: ActivatedRoute, public dataService: DataService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.deptId = params.get('id');
      if (this.deptId) {
        this.dataService.getTeachersByDepartment(this.deptId).subscribe({
          next: (data) => this.teachers = data,
          error: (err) => console.error('Error loading teachers', err)
        });
      }
    });
  }
}
