import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-specialty-mi',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="specialty-page">
      <section class="hero-section" style="background: linear-gradient(135deg, #0055a4, #003366); min-height: 400px; display: flex; align-items: center; color: white;">
        <div class="container text-center">
          <span class="badge bg-light text-dark mb-3">{{ specialty.department }}</span>
          <h1 class="display-4 fw-bold">{{ specialty.name }}</h1>
          <p class="lead">{{ specialty.acronym }} - {{ specialty.tagline }}</p>
          <a routerLink="/departement/genie-mecanique" class="btn btn-outline-light mt-3">
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
export class SpecialtyMIComponent {
  specialty = {
    name: 'Maintenance Industrielle',
    acronym: 'MI',
    department: 'Génie Mécanique',
    tagline: 'Assurez la performance des équipements',
    description: 'La filière Maintenance Industrielle (MI) forme des licences spécialisés dans l\'optimisation, la surveillance et la réparation des équipements et systèmes de production pour assurer la continuité et l\'efficacité des processus industriels.',
    jobs: ['Responsable Maintenance', 'Ingénieur Fiabilité', 'Chef de Service Maintenance', 'Expert en Maintenance Prédictive', 'Consultant Maintenance']
  };
}
