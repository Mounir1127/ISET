import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-specialty-ei',
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

      <section class="py-5 bg-light" *ngIf="specialty.curriculum">
        <div class="container">
          <h2 class="text-center mb-5" style="color: #0055a4;">Programme de formation</h2>
          <div class="row">
            <div class="col-lg-4 mb-4" *ngFor="let sem of specialty.curriculum">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-warning text-dark">
                  <h4 class="mb-0">{{ sem.semester }}</h4>
                </div>
                <div class="card-body">
                  <ul class="list-unstyled mb-0">
                    <li class="mb-2" *ngFor="let module of sem.modules">
                      <i class="fas fa-bolt text-warning me-2"></i>
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
export class SpecialtyEIComponent {
  specialty = {
    name: 'Électricité Industrielle',
    acronym: 'EI',
    department: 'Génie Électrique',
    tagline: 'Maîtrisez l\'énergie de demain',
    description: 'La filière Électricité Industrielle (EI) forme des licences capables de concevoir, installer, maintenir et optimiser les systèmes électriques et automatisés dans les environnements industriels. Le diplômé est chargé de l\'installation des équipements électriques, électroniques et électromécaniques, que ce soit sur site ou en atelier. Il réalise les réglages nécessaires et effectue les essais afin de garantir le bon fonctionnement du matériel conformément aux exigences techniques. Il établit un rapport technique d\'installation et assure la formation des utilisateurs à l\'exploitation du matériel. Son champ d\'intervention peut également inclure la maintenance, le dépannage, la mise au point des systèmes ainsi que la rédaction des notices de fonctionnement et d\'utilisation. Il veille au respect strict des règles de sécurité et peut, selon les besoins, assurer la coordination et l\'encadrement d\'une équipe.',
    jobs: ['Ingénieur Électricien', 'Responsable Maintenance Électrique', 'Chef de Projet Énergie', 'Technicien Haute Tension', 'Expert en Énergies Renouvelables'],
    curriculum: [
      {
        semester: 'Semestre 3 (S3)',
        modules: [
          'Électrotechnique',
          'Électronique de puissance',
          'Électronique analogique',
          'Automatique (systèmes asservis)',
          'Automatismes industriels',
          'Instrumentation industrielle',
          'Microcontrôleurs',
          'Ateliers (électrotechnique, électronique, automatique, automatisme, instrumentation)',
          'Anglais technique',
          'Français',
          'Droit'
        ]
      },
      {
        semester: 'Semestre 4 (S4)',
        modules: [
          'Machines électriques',
          'Convertisseurs statiques',
          'Électronique de commande',
          'Réseaux électriques',
          'Régulation industrielle',
          'Automates Programmables Industriels (API)',
          'Réseaux locaux industriels',
          'Ateliers (machines, électronique de puissance, régulation, API)',
          'Anglais',
          'Français',
          'Culture entrepreneuriale'
        ]
      },
      {
        semester: 'Semestre 5 (S5)',
        modules: [
          'Commande des machines électriques',
          'Variateurs de vitesse',
          'Distribution et exploitation de l\'énergie électrique',
          'Énergies renouvelables',
          'Qualité et maintenance industrielle',
          'Conception des installations industrielles',
          'Domotique',
          'Circuits programmables / systèmes embarqués',
          'Mini-projet',
          'Création d\'entreprise'
        ]
      }
    ]
  };
}
