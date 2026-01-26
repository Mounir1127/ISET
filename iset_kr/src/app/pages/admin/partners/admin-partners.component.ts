import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Partner {
    _id?: string;
    name: string;
    logo: string;
    link?: string;
    type: 'academic' | 'industrial' | 'international';
}

@Component({
    selector: 'app-admin-partners',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-navy fw-bold">Gestion des Partenaires</h2>
        <button class="btn btn-primary" (click)="openModal()">
          <i class="fas fa-plus me-2"></i> Nouveau Partenaire
        </button>
      </div>

      <div class="row g-4">
        <div class="col-md-4" *ngFor="let partner of partners">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body text-center">
              <img [src]="getImageUrl(partner.logo)" [alt]="partner.name" class="img-fluid mb-3" style="max-height: 100px; object-fit: contain;">
              <h5 class="card-title fw-bold text-navy">{{ partner.name }}</h5>
              <div class="badge mb-2" 
                [class.bg-info]="partner.type === 'academic'"
                [class.bg-warning]="partner.type === 'industrial'"
                [class.bg-success]="partner.type === 'international'">
                {{ getTypeName(partner.type) }}
              </div>
              <p class="small text-muted" *ngIf="partner.link">
                <a [href]="partner.link" target="_blank" class="text-secondary"><i class="fas fa-link me-1"></i> {{ partner.link }}</a>
              </p>
            </div>
            <div class="card-footer bg-white border-0 text-center pb-3">
              <button class="btn btn-sm btn-outline-primary me-2" (click)="editPartner(partner)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" (click)="deletePartner(partner)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="partnerModal" tabindex="-1" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? 'Modifier' : 'Ajouter' }} un Partenaire</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="savePartner()">
                <div class="mb-3">
                  <label class="form-label">Nom du Partenaire</label>
                  <input type="text" class="form-control" [(ngModel)]="currentPartner.name" name="name" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Type</label>
                  <select class="form-select" [(ngModel)]="currentPartner.type" name="type" required>
                    <option value="academic">Académique</option>
                    <option value="industrial">Industriel</option>
                    <option value="international">International</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Lien (Site Web)</label>
                  <input type="text" class="form-control" [(ngModel)]="currentPartner.link" name="link">
                </div>
                <div class="mb-3">
                  <label class="form-label">Logo</label>
                  <input type="file" class="form-control" (change)="onFileSelected($event)" accept="image/*">
                  <div *ngIf="currentPartner.logo && !selectedFile" class="mt-2">
                    <small>Logo actuel:</small><br>
                    <img [src]="getImageUrl(currentPartner.logo)" height="50">
                  </div>
                </div>
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
                  <button type="submit" class="btn btn-primary">Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" *ngIf="showModal"></div>
    </div>
  `,
    styles: [`
    .text-navy { color: #0055a4; }
  `]
})
export class AdminPartnersComponent implements OnInit {
    partners: Partner[] = [];
    showModal = false;
    isEditing = false;
    currentPartner: Partner = { name: '', logo: '', type: 'academic' };
    selectedFile: File | null = null;
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadPartners();
    }

    loadPartners() {
        this.http.get<Partner[]>(`${this.apiUrl}/partners`).subscribe({
            next: (data) => this.partners = data,
            error: (err) => console.error('Error loading partners', err)
        });
    }

    getTypeName(type: string): string {
        const types: { [key: string]: string } = {
            'academic': 'Académique',
            'industrial': 'Industriel',
            'international': 'International'
        };
        return types[type] || type;
    }

    getImageUrl(url: string | undefined): string {
        if (!url) return 'assets/images/default-logo.png';
        if (url.startsWith('http')) return url;
        if (url.startsWith('assets/')) return url;
        return `${this.apiUrl}/${url}`; // Adjust based on how uploads are served
    }

    openModal() {
        this.isEditing = false;
        this.currentPartner = { name: '', logo: '', type: 'academic' };
        this.selectedFile = null;
        this.showModal = true;
    }

    editPartner(partner: Partner) {
        this.isEditing = true;
        this.currentPartner = { ...partner };
        this.selectedFile = null;
        this.showModal = true;
    }

    deletePartner(partner: Partner) {
        if (confirm(`Supprimer le partenaire ${partner.name} ?`)) {
            this.http.delete(`${this.apiUrl}/partners/${partner._id}`).subscribe({
                next: () => this.loadPartners(),
                error: (err) => alert('Erreur lors de la suppression')
            });
        }
    }

    closeModal() {
        this.showModal = false;
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    savePartner() {
        const formData = new FormData();
        formData.append('name', this.currentPartner.name);
        formData.append('type', this.currentPartner.type);
        if (this.currentPartner.link) formData.append('link', this.currentPartner.link);
        if (this.selectedFile) {
            formData.append('logo', this.selectedFile);
        } else if (this.currentPartner.logo) {
            formData.append('logo', this.currentPartner.logo);
        }

        if (this.isEditing && this.currentPartner._id) {
            this.http.put(`${this.apiUrl}/partners/${this.currentPartner._id}`, formData).subscribe({
                next: () => {
                    this.closeModal();
                    this.loadPartners();
                },
                error: (err) => alert('Erreur lors de la modification')
            });
        } else {
            this.http.post(`${this.apiUrl}/partners`, formData).subscribe({
                next: () => {
                    this.closeModal();
                    this.loadPartners();
                },
                error: (err) => alert('Erreur lors de la création')
            });
        }
    }
}
