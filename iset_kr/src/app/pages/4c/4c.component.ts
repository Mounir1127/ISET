import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-4c',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="page-4c">
      <div class="top-bar">
        <a routerLink="/" class="back-home-btn">
          <i class="fas fa-arrow-left"></i>
          <span>Retour à l'accueil</span>
        </a>
      </div>

      <div class="container animate-fade-in">
        <header class="page-header">
          <div class="hero-badge">Centre de Carrière</div>
          <h1>Espace 4C</h1>
          <p class="subtitle">Centre de Carrière et de Certification des Compétences</p>
          <div class="title-line"></div>
        </header>

        <div class="content-grid">
          <section class="info-card main-mission">
            <div class="card-icon"><i class="fas fa-rocket"></i></div>
            <h3>Notre Mission</h3>
            <p>Le centre 4C a pour mission principale de faciliter l'insertion professionnelle des étudiants de l'ISET Kairouan en renforçant leurs compétences transversales et techniques.</p>
            <ul class="mission-list">
              <li><i class="fas fa-check-circle"></i> Accompagner les étudiants dans leur projet professionnel</li>
              <li><i class="fas fa-check-circle"></i> Organiser des sessions de certification (Microsoft, Cisco, etc.)</li>
              <li><i class="fas fa-check-circle"></i> Développer l'esprit d'entrepreneuriat</li>
              <li><i class="fas fa-check-circle"></i> Établir des partenariats avec le monde socio-économique</li>
            </ul>
          </section>

          <div class="side-column">
            <section class="info-card small-card">
              <div class="card-icon"><i class="fas fa-graduation-cap"></i></div>
              <h3>Certifications</h3>
              <p>Accédez aux programmes de certification les plus demandés sur le marché mondial.</p>
              <a routerLink="/certifications" class="card-link">Voir les certifications <i class="fas fa-arrow-right"></i></a>
            </section>

            <section class="info-card small-card info-blue">
              <div class="card-icon"><i class="fas fa-briefcase"></i></div>
              <h3>Stages & Emplois</h3>
              <p>Consultez les offres de stages et d'emplois partagées par nos partenaires.</p>
              <button class="card-btn">Consulter les offres</button>
            </section>
          </div>
        </div>

        <section class="stats-bar">
          <div class="stat-item">
            <span class="stat-num">500+</span>
            <span class="stat-label">Étudiants formés</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">20+</span>
            <span class="stat-label">Partenaires actifs</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">15+</span>
            <span class="stat-label">Certifications proposées</span>
          </div>
        </section>
      </div>
    </div>
  `,
    styles: [`
    .page-4c {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding-bottom: 5rem;
    }

    .top-bar { padding: 2rem; }

    .back-home-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.9rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;

      &:hover {
        background: white;
        color: #0f172a;
        transform: translateY(-2px);
      }
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .page-header {
      text-align: center;
      margin-bottom: 5rem;

      .hero-badge {
        display: inline-block;
        background: #f59e0b;
        color: #0f172a;
        padding: 0.4rem 1.2rem;
        border-radius: 6px;
        font-weight: 900;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 2px;
        margin-bottom: 1.5rem;
      }

      h1 {
        font-size: 4rem;
        font-weight: 900;
        margin: 0;
        letter-spacing: -2px;
        background: linear-gradient(to right, #fff, #94a3b8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .subtitle {
        color: #94a3b8;
        font-size: 1.2rem;
        margin-top: 1rem;
      }

      .title-line {
        width: 100px;
        height: 6px;
        background: #f59e0b;
        margin: 2rem auto;
        border-radius: 10px;
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 2.5rem;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 3rem;
      border-radius: 24px;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s;

      &:hover { transform: translateY(-5px); }

      .card-icon {
        width: 60px;
        height: 60px;
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin-bottom: 2rem;
      }

      h3 { font-size: 1.8rem; font-weight: 800; margin-bottom: 1.5rem; }
      p { color: #94a3b8; line-height: 1.8; font-size: 1.1rem; }
    }

    .mission-list {
      list-style: none;
      padding: 0;
      margin-top: 2rem;
      display: grid;
      gap: 1.2rem;

      li {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #cbd5e1;

        i { color: #10b981; }
      }
    }

    .side-column { display: flex; flex-direction: column; gap: 2.5rem; }

    .small-card {
      padding: 2.5rem;
      background: rgba(255, 255, 255, 0.02);

      &.info-blue .card-icon {
        background: rgba(0, 85, 164, 0.1);
        color: #3b82f6;
      }

      h3 { font-size: 1.4rem; }
      p { font-size: 0.95rem; }

      .card-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #f59e0b;
        text-decoration: none;
        font-weight: 700;
        margin-top: 1.5rem;
        &:hover { text-decoration: underline; }
      }

      .card-btn {
        width: 100%;
        padding: 1rem;
        background: #0055a4;
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 700;
        margin-top: 1.5rem;
        cursor: pointer;
        transition: 0.3s;
        &:hover { opacity: 0.9; }
      }
    }

    .stats-bar {
      display: flex;
      justify-content: space-around;
      background: rgba(245, 158, 11, 0.05);
      border: 1px solid rgba(245, 158, 11, 0.1);
      margin-top: 5rem;
      padding: 3rem;
      border-radius: 24px;
      text-align: center;

      .stat-num {
        display: block;
        font-size: 2.5rem;
        font-weight: 900;
        color: #f59e0b;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        color: #94a3b8;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 1px;
      }
    }

    .animate-fade-in { animation: fadeIn 1s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    @media (max-width: 992px) {
      .content-grid { grid-template-columns: 1fr; }
      .page-header h1 { font-size: 3rem; }
    }
  `]
})
export class FourCComponent { }
