import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-specialty-cfm',
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
export class SpecialtyCFMComponent {
  specialty = {
    name: 'Construction et Fabrication Mécanique',
    acronym: 'CFM',
    department: 'Génie Mécanique',
    tagline: 'Concevez et fabriquez l\'avenir',
    description: 'La filière "Construction et Fabrication Mécanique (CFM)" forme des licences spécialisés dans la conception, la fabrication, l\'assemblage et la maintenance des systèmes et produits mécaniques.',
    jobs: ['Ingénieur Bureau d\'Études', 'Concepteur CAO/DAO', 'Responsable Fabrication', 'Ingénieur Méthodes', 'Chef de Projet Industriel']
  };
}
