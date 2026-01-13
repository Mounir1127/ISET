import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CertificateCardComponent, Certificate } from '../../components/certificate-card/certificate-card.component';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, RouterModule, CertificateCardComponent],
  template: `
    <div class="certifications-page">
      <div class="top-bar">
        <a routerLink="/" class="back-home-btn">
          <i class="fas fa-arrow-left"></i>
          <span>Retour à l'accueil</span>
        </a>
      </div>

      <div class="container animate-fade-in">
        <header class="page-header">
          <div class="title-wrap">
            <span class="subtitle">Qualité & Excellence</span>
            <h2>Nos Certifications</h2>
            <div class="title-line"></div>
          </div>
          <p class="description">
            L'ISET Kairouan s'engage dans une démarche d'amélioration continue pour offrir 
            un enseignement technique de haut niveau, certifié par les normes internationales.
          </p>
        </header>

        <div class="certificates-grid">
          <app-certificate-card *ngFor="let cert of certificates; let i = index" 
            [certificate]="cert"
            class="animate-fade-up"
            [style.animation-delay]="i * 0.1 + 's'">
          </app-certificate-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .certifications-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
      padding-bottom: 5rem;
    }

    .top-bar {
      padding: 2rem;
      display: flex;
      justify-content: flex-start;
    }

    .back-home-btn {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem 1.5rem;
      background: white;
      color: #0055a4;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: 0 4px 15px rgba(0, 85, 164, 0.1);
      transition: all 0.3s ease;
      border: 1px solid rgba(0, 85, 164, 0.05);

      i { transition: transform 0.3s ease; }
      
      &:hover {
        background: #0055a4;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 85, 164, 0.2);
        i { transform: translateX(-4px); }
      }
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .page-header {
      text-align: center;
      margin-bottom: 4rem;
      
      .title-wrap {
        margin-bottom: 1.5rem;
        .subtitle {
          display: block;
          color: #f59e0b;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }
        h2 {
          font-size: 2.8rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
          letter-spacing: -1px;
        }
        .title-line {
          width: 80px;
          height: 6px;
          background: #0055a4;
          margin: 1.5rem auto;
          border-radius: 10px;
        }
      }

      .description {
        max-width: 700px;
        margin: 0 auto;
        color: #64748b;
        font-size: 1.1rem;
        line-height: 1.7;
      }
    }

    .certificates-grid {
      display: grid;
      gap: 2.5rem;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }

    .animate-fade-in { animation: fadeIn 0.8s ease-out; }
    .animate-fade-up { animation: fadeUp 0.8s ease-out both; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .page-header h2 { font-size: 2.22rem; }
      .certificates-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CertificationsComponent {
  certificates: Certificate[] = [
    {
      id: 1,
      title: 'Système de Management de la Qualité',
      standard: 'ISO 9001:2015',
      description: 'Certification garantissant la qualité de nos services.',
      issuedDate: '2023-01-01',
      badge: 'SMG'
    },
    {
      id: 2,
      title: 'Système de Management des Organisations Éducatives',
      standard: 'ISO 21001:2018',
      description: 'Certification spécifique aux établissements d\'enseignement.',
      issuedDate: '2024-01-01',
      badge: 'SMG'
    }
  ];
}
