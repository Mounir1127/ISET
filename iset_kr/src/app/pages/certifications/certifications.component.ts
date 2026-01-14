import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Certificate } from '../../components/certificate-card/certificate-card.component';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss']
})
export class CertificationsComponent implements OnInit {
  certificates: Certificate[] = [
    {
      id: 1,
      title: 'Système de Management de la Qualité',
      standard: 'ISO 9001:2015',
      description: 'Certification garantissant la qualité de nos services et l\'amélioration continue des processus.',
      issuedDate: '2023-01-01',
      badge: 'SMQ'
    },
    {
      id: 2,
      title: 'Système de Management des Organisations Éducatives',
      standard: 'ISO 21001:2018',
      description: 'Certification spécifique aux établissements d\'enseignement pour favoriser la réussite des apprenants.',
      issuedDate: '2024-01-01',
      badge: 'SMOE'
    }
  ];

  ngOnInit(): void {
    this.initScrollAnimations();
  }

  initScrollAnimations(): void {
    if (typeof window !== 'undefined') {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);

      setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          observer.observe(el);
        });
      }, 100);
    }
  }
}
