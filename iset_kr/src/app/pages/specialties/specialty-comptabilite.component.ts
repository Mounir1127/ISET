import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-specialty-comptabilite',
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
export class SpecialtyComptabiliteComponent {
  specialty = {
    name: 'Comptabilité et Finance',
    department: 'Sciences Économiques & Gestion',
    tagline: 'Maîtrisez les chiffres de l\'entreprise',
    description: 'La filière Comptabilité forme des experts en gestion financière, audit et contrôle de gestion, capables d\'accompagner les entreprises dans leur développement.',
    jobs: ['Expert Comptable', 'Auditeur Financier', 'Contrôleur de Gestion', 'Directeur Administratif et Financier', 'Consultant Fiscal']
  };
}
