import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-specialty-rsi',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './specialty-dsi.component.html',
  styleUrls: ['./specialty-dsi.component.scss']
})
export class SpecialtyRSIComponent {
  specialty = {
    name: 'Réseaux et Services Informatiques',
    acronym: 'RSI',
    department: 'Technologies de l\'Informatique',
    tagline: 'Maîtrisez l\'infrastructure numérique',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80',

    overview: {
      description: 'La filière RSI forme des spécialistes capables de concevoir, déployer et sécuriser des infrastructures réseaux complexes. Nos étudiants maîtrisent l\'administration système, le cloud computing et les enjeux cruciaux de la cybersécurité.',
      duration: '3 ans (Licence Appliquée)',
      degree: 'Licence Appliquée en Réseaux et Services Informatiques'
    },

    curriculum: [
      {
        year: 'Première Année',
        semesters: [
          {
            name: 'Semestre 1',
            modules: [
              'Architecture des ordinateurs',
              'Algorithmique & Programmation C',
              'Mathématiques appliquées',
              'Anglais technique',
              'Communication professionnelle'
            ]
          },
          {
            name: 'Semestre 2',
            modules: [
              'Bases des réseaux (CCNA1)',
              'Systèmes d\'exploitation (Linux)',
              'Programmation Web',
              'Bases de données',
              'Électronique numérique'
            ]
          }
        ]
      },
      {
        year: 'Deuxième Année',
        semesters: [
          {
            name: 'Semestre 3',
            modules: [
              'Routage & Commutation (CCNA2-3)',
              'Administration Linux avancée',
              'Programmation Python',
              'Services Réseaux (DNS, DHCP, Mail)',
              'Sécurité informatique de base'
            ]
          },
          {
            name: 'Semestre 4',
            modules: [
              'Virtualisation & Cloud (VMware, Proxmox)',
              'Sécurité périmétrique (Firewalls)',
              'Réseaux sans-fil & Mobilité',
              'Supervision & Monitoring',
              'Stage technicien (1 mois)'
            ]
          }
        ]
      },
      {
        year: 'Troisième Année',
        semesters: [
          {
            name: 'Semestre 5',
            modules: [
              'Cyber-Sûreté & Audit',
              'Cloud Computing avancé (Azure/AWS)',
              'Voix sur IP (VoIP)',
              'Management de projet IT',
              'Préparation PFE'
            ]
          },
          {
            name: 'Semestre 6',
            modules: [
              'Stage de fin d\'études (4 mois)',
              'Soutenance PFE'
            ]
          }
        ]
      }
    ],

    skills: {
      technical: [
        'Réseaux: Cisco, Juniper, Routage BGP/OSPF',
        'Systèmes: Linux (Ubuntu/Debian/RHEL), Windows Server',
        'Sécurité: Fortinet, pfSense, Wireshark, Metasploit',
        'Cloud: Docker, Kubernetes, AWS, Azure',
        'Scripting: Python, Bash, PowerShell'
      ],
      soft: [
        'Analyse de pannes (Troubleshooting)',
        'Gestion du stress en incident',
        'Rédaction de rapports techniques',
        'Travail en équipe',
        'Veille technologique sécurité'
      ]
    },

    careers: {
      jobs: [
        'Administrateur Réseaux & Systèmes',
        'Ingénieur Sécurité Informatique',
        'Cloud Consultant',
        'Analyste CyberSOC',
        'Technicien Support VIP',
        'Intégrateur Solutions Réseaux'
      ],
      sectors: [
        'Opérateurs Télécoms',
        'Banques et Institutions Financières',
        'Sociétés de Services (ESN)',
        'Centres de Données (Datacenters)',
        'Organismes Gouvernementaux'
      ],
      salary: '1100 - 2900 DT/mois (débutant)'
    },

    testimonials: [
      {
        name: 'Sami Karray',
        role: 'Network Engineer chez Tunisie Telecom',
        year: 'Promotion 2021',
        photo: 'assets/images/testimonials/default-avatar.png',
        quote: 'La formation RSI à l\'ISET Kairouan est d\'un excellent niveau. Les équipements labo Cisco m\'ont permis de pratiquer en conditions réelles.'
      }
    ],

    admission: {
      requirements: ['Baccalauréat Scientifique ou Technique', 'Esprit d\'analyse'],
      process: ['Orientation.tn', 'Dossier ISET', 'Test de niveau', 'Entretien'],
      contact: {
        email: 'rsi.ti@isetkr.tn',
        phone: '+216 77 123 456',
        address: 'Département TI, ISET Kairouan'
      }
    }
  };
}
