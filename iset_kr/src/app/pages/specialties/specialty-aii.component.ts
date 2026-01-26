import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-specialty-aii',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="specialty-page">
      <section class="hero-section" style="background: linear-gradient(135deg, #0055a4, #003366); min-height: 400px; display: flex; align-items: center; color: white;">
        <div class="container text-center">
          <span class="badge bg-light text-dark mb-3">{{ specialty.department }}</span>
          <h1 class="display-4 fw-bold">{{ specialty.name }}</h1>
          <p class="lead">{{ specialty.acronym }} - {{ specialty.tagline }}</p>
          <a routerLink="/departement/genie-electrique" class="btn btn-outline-light mt-3">
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

      <section class="py-5 bg-light" *ngIf="specialty.skills">
        <div class="container">
          <h2 class="text-center mb-4" style="color: #0055a4;">Compétences recherchées</h2>
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <ul class="list-unstyled mb-0">
                    <li class="mb-3" *ngFor="let skill of specialty.skills">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      <span>{{ skill }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5" *ngIf="specialty.curriculum">
        <div class="container">
          <h2 class="text-center mb-5" style="color: #0055a4;">Programme de formation</h2>
          <div class="row">
            <div class="col-lg-4 mb-4" *ngFor="let sem of specialty.curriculum">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-primary text-white">
                  <h4 class="mb-0">{{ sem.semester }}</h4>
                </div>
                <div class="card-body">
                  <ul class="list-unstyled mb-0">
                    <li class="mb-2" *ngFor="let module of sem.modules">
                      <i class="fas fa-book text-primary me-2"></i>
                      <small>{{ module }}</small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class SpecialtyAIIComponent {
  specialty = {
    name: 'Automatismes et Informatique Industrielle',
    acronym: 'AII',
    department: 'Génie Électrique',
    tagline: 'L\'industrie 4.0 commence ici',
    description: 'La spécialité Automatismes et Informatique Industrielle (AII) forme des techniciens capables de concevoir, programmer, installer et maintenir des systèmes automatisés utilisés dans les environnements industriels. Elle couvre les domaines de l\'automatisme, de l\'électricité industrielle, de l\'électronique, de l\'informatique industrielle et des réseaux industriels. Les diplômés de cette spécialité interviennent sur les automates programmables industriels (API/PLC), les systèmes de supervision, les capteurs, les actionneurs ainsi que les systèmes électromécaniques. Ils participent à la mise en service, au diagnostic, à la maintenance et à l\'optimisation des installations automatisées, tout en respectant les normes de sécurité et de qualité en vigueur dans le milieu industriel.',
    jobs: ['Ingénieur Automaticien', 'Roboticien', 'Superviseur SCADA', 'Ingénieur IoT Industriel', 'Chef de Projet Industrie 4.0'],
    skills: [
      'Maîtrise des technologies utilisées dans les systèmes industriels',
      'Être capable de mettre en œuvre une chaîne de régulation industrielle',
      'Compétence élargie, capacité à appréhender tous les aspects techniques d\'un projet, ouverture d\'esprit',
      'Valider la configuration d\'un réseau',
      'Gérer un système en temps réel',
      'Capacité à suivre l\'évolution technologique de son champ de compétences au sens large, ce qui suppose l\'acquisition des fondamentaux et à aborder des tâches complexes'
    ],
    curriculum: [
      {
        semester: 'Semestre 3 (S3)',
        modules: [
          'Électrotechnique',
          'Électronique de puissance',
          'Automatique 1 (Systèmes asservis linéaires continus)',
          'Électronique analogique',
          'Traitement du signal',
          'Automatismes industriels',
          'Instrumentation industrielle',
          'Programmation Python',
          'Anglais technique',
          'Français',
          'Droit',
          'Ateliers (électrotechnique, électronique de puissance, automatique, électronique analogique, automatismes, instrumentation)'
        ]
      },
      {
        semester: 'Semestre 4 (S4)',
        modules: [
          'Automatique 2 (Systèmes échantillonnés, modélisation)',
          'Réseaux locaux industriels',
          'Programmation avancée des API (PLC)',
          'Bases de données',
          'Développement informatique',
          'Microcontrôleurs',
          'Variateurs de vitesse industriels',
          'Électronique embarquée',
          'Culture entrepreneuriale',
          'Anglais / Français',
          'Ateliers (automatique, systèmes automatisés, microcontrôleurs, variateurs)'
        ]
      },
      {
        semester: 'Semestre 5 (S5)',
        modules: [
          'Systèmes robotisés',
          'Systèmes temps réel',
          'Régulation industrielle',
          'Supervision des processus industriels (SCADA)',
          'Circuits programmables (FPGA, DSP)',
          'Qualité et maintenance industrielle',
          'Pilotage des systèmes industriels',
          'Internet des Objets (IoT)',
          'Création d\'entreprise',
          'Anglais',
          'Ateliers (robotique, temps réel, régulation, supervision, FPGA/DSP, IoT)'
        ]
      }
    ]
  };
}
