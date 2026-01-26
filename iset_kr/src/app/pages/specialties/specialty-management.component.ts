import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-specialty-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="specialty-page">
      <section class="hero-section" style="background: linear-gradient(135deg, #0055a4, #003366); min-height: 400px; display: flex; align-items: center; color: white;">
        <div class="container text-center">
          <span class="badge bg-light text-dark mb-3">{{ specialty.department }}</span>
          <h1 class="display-4 fw-bold">{{ specialty.name }}</h1>
          <p class="lead">{{ specialty.tagline }}</p>
          <a routerLink="/departement/gestion" class="btn btn-outline-light mt-3">
            <i class="fas fa-arrow-left me-2"></i> Retour au département
          </a>
        </div>
      </section>

      <section class="py-5">
        <div class="container">
          <h2 class="text-center mb-4" style="color: #0055a4;">Présentation</h2>
          <p class="lead text-center">{{ specialty.description }}</p>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class SpecialtyManagementComponent {
  specialty = {
    name: 'Management et Administration des Affaires',
    department: 'Sciences Économiques & Gestion',
    tagline: 'Devenez les leaders de demain',
    description: 'La filière Management forme des cadres gestionnaires polyvalents, capables de piloter des projets, manager des équipes et développer des stratégies d\'entreprise.',
    jobs: ['Chef de Projet', 'Responsable RH', 'Consultant en Management', 'Directeur Commercial', 'Entrepreneur']
  };
}
