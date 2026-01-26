import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-page py-10" *ngIf="teacher">
      <div class="container">
        <div class="mb-6">
          <a (click)="goBack()" class="btn btn-link text-navy ps-0 cursor-pointer">
            <i class="fas fa-arrow-left me-2"></i> Retour
          </a>
        </div>

        <div class="row g-5">
          <div class="col-lg-4 text-center">
            <div class="profile-img-card shadow-lg p-3 bg-white mb-4">
              <img [src]="dataService.getImageUrl(teacher.profileImage, teacher.name)" 
                   [alt]="teacher.name" 
                   class="img-fluid rounded-4 profile-main-img">
            </div>
            <div class="contact-card bg-navy text-white p-4 rounded-4 shadow">
              <h4 class="h5 mb-3 border-bottom pb-2 border-white-50 text-gold">Contact</h4>
              <p class="mb-2"><i class="fas fa-envelope me-2 text-gold"></i> {{ teacher.email }}</p>
              <p class="mb-0" *ngIf="teacher.phone"><i class="fas fa-phone me-2 text-gold"></i> {{ teacher.phone }}</p>
              <p class="mb-0" *ngIf="teacher.office"><i class="fas fa-door-open me-2 text-gold"></i> Bureau: {{ teacher.office }}</p>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="p-5 bg-white rounded-5 shadow-sm border border-light">
              <span class="badge bg-gold text-white mb-2 uppercase tracking-widest px-3 py-2">{{ teacher.grade }}</span>
              <h1 class="display-3 fw-black text-navy mb-1">{{ teacher.name }}</h1>
              <p class="h4 text-muted mb-5">{{ teacher.speciality }}</p>
              
              <div class="section-block mb-5">
                <h3 class="h4 text-navy border-start border-4 border-gold ps-3 mb-3">Biographie</h3>
                <p class="lead text-secondary">{{ teacher.bio || 'Aucune biographie disponible pour le moment.' }}</p>
              </div>

              <div class="row g-4 mt-2">
                <div class="col-md-6" *ngIf="teacher.department">
                  <div class="info-item-card p-4 rounded-4 bg-light border-0">
                    <i class="fas fa-university fa-2x text-navy mb-3"></i>
                    <h4 class="h6 text-muted mb-1">Département</h4>
                    <p class="h5 text-navy mb-0">{{ teacher.department.name }}</p>
                  </div>
                </div>
                <div class="col-md-6" *ngIf="teacher.matricule">
                  <div class="info-item-card p-4 rounded-4 bg-light border-0">
                    <i class="fas fa-id-badge fa-2x text-navy mb-3"></i>
                    <h4 class="h6 text-muted mb-1">Matricule</h4>
                    <p class="h5 text-navy mb-0">{{ teacher.matricule }}</p>
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
    .profile-page { background: #fefefe; min-height: 90vh; }
    .text-navy { color: #001b44; }
    .bg-navy { background: #001b44; }
    .text-gold { color: #c5a021; }
    .bg-gold { background: #c5a021; }
    .fw-black { font-weight: 900; }
    .profile-main-img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }
    .profile-img-card { border-radius: 25px; }
    .cursor-pointer { cursor: pointer; }
    .rounded-5 { border-radius: 40px !important; }
    .rounded-4 { border-radius: 25px !important; }
    .tracking-widest { letter-spacing: 2px; }
  `]
})
export class TeacherProfileComponent implements OnInit {
  teacher: any | null = null;

  constructor(private route: ActivatedRoute, public dataService: DataService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dataService.getTeacherById(id).subscribe({
        next: (data) => this.teacher = data,
        error: (err) => console.error('Error loading teacher', err)
      });
    }
  }

  goBack(): void {
    window.history.back();
  }
}
