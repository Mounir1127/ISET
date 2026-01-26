import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-specialty-dsi',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './specialty-dsi.component.html',
    styleUrls: ['./specialty-dsi.component.scss']
})
export class SpecialtyDSIComponent {
    specialty = {
        name: 'Développement des Systèmes d\'Information',
        acronym: 'DSI',
        department: 'Technologie Informatique',
        tagline: 'Créez les applications de demain',
        heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80',

        overview: {
            description: 'La filière DSI forme des développeurs polyvalents capables de concevoir, développer et maintenir des applications web, mobiles et desktop. Nos diplômés maîtrisent les dernières technologies et méthodologies de développement.',
            duration: '3 ans (Licence Appliquée)',
            degree: 'Licence Appliquée en Développement des Systèmes d\'Information'
        },

        curriculum: [
            {
                year: 'Première Année',
                semesters: [
                    {
                        name: 'Semestre 1',
                        modules: [
                            'Algorithmique et structures de données',
                            'Programmation C',
                            'Architecture des ordinateurs',
                            'Mathématiques pour l\'informatique',
                            'Anglais technique',
                            'Communication professionnelle'
                        ]
                    },
                    {
                        name: 'Semestre 2',
                        modules: [
                            'Programmation orientée objet (Java)',
                            'Bases de données relationnelles',
                            'Systèmes d\'exploitation',
                            'Réseaux informatiques',
                            'Développement web (HTML/CSS/JS)',
                            'Gestion de projet'
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
                            'Frameworks web (Angular/React)',
                            'Développement mobile (Android/iOS)',
                            'Bases de données avancées (NoSQL)',
                            'Architecture logicielle',
                            'Tests et qualité logicielle',
                            'DevOps et CI/CD'
                        ]
                    },
                    {
                        name: 'Semestre 4',
                        modules: [
                            'Cloud Computing (AWS/Azure)',
                            'Sécurité des applications',
                            'Intelligence Artificielle',
                            'Big Data et Analytics',
                            'Stage en entreprise (1 mois)',
                            'Projet tutoré'
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
                            'Architecture microservices',
                            'Développement full-stack avancé',
                            'Blockchain et technologies émergentes',
                            'Management de projet IT',
                            'Entrepreneuriat digital',
                            'Projet de fin d\'études (début)'
                        ]
                    },
                    {
                        name: 'Semestre 6',
                        modules: [
                            'Stage de fin d\'études (3-4 mois)',
                            'Projet de fin d\'études (soutenance)',
                            'Préparation à la vie professionnelle'
                        ]
                    }
                ]
            }
        ],

        skills: {
            technical: [
                'Langages: Java, Python, JavaScript, TypeScript, C#',
                'Frameworks: Angular, React, Spring Boot, Node.js, .NET',
                'Bases de données: MySQL, PostgreSQL, MongoDB, Redis',
                'DevOps: Docker, Kubernetes, Jenkins, GitLab CI',
                'Cloud: AWS, Azure, Google Cloud Platform',
                'Mobile: Android (Kotlin), iOS (Swift), React Native'
            ],
            soft: [
                'Résolution de problèmes complexes',
                'Travail en équipe agile',
                'Communication technique',
                'Gestion du temps et des priorités',
                'Apprentissage continu',
                'Créativité et innovation'
            ]
        },

        careers: {
            jobs: [
                'Développeur Full-Stack',
                'Développeur Mobile',
                'Architecte Logiciel',
                'DevOps Engineer',
                'Tech Lead',
                'Chef de Projet IT',
                'Consultant IT',
                'Entrepreneur Tech'
            ],
            sectors: [
                'Startups technologiques',
                'ESN (Entreprises de Services Numériques)',
                'Banques et assurances',
                'E-commerce',
                'Télécommunications',
                'Administration publique',
                'Industrie 4.0'
            ],
            salary: '1200 - 3000 DT/mois (débutant), 3000 - 8000 DT/mois (confirmé)'
        },

        testimonials: [
            {
                name: 'Ahmed Ben Salem',
                role: 'Full-Stack Developer chez Orange Tunisie',
                year: 'Promotion 2022',
                photo: 'assets/images/testimonials/default-avatar.png',
                quote: 'La formation DSI m\'a donné toutes les compétences nécessaires pour réussir dans le monde professionnel. Les projets pratiques et les stages m\'ont permis d\'être opérationnel dès mon embauche.'
            },
            {
                name: 'Salma Trabelsi',
                role: 'Mobile Developer chez Vermeg',
                year: 'Promotion 2021',
                photo: 'assets/images/testimonials/default-avatar.png',
                quote: 'J\'ai particulièrement apprécié la qualité de l\'enseignement et l\'accompagnement des professeurs. Aujourd\'hui, je travaille sur des projets internationaux passionnants.'
            }
        ],

        admission: {
            requirements: [
                'Baccalauréat (toutes sections, priorité Sciences)',
                'Dossier de candidature complet',
                'Test d\'admission (selon disponibilité)',
                'Entretien de motivation'
            ],
            process: [
                'Inscription en ligne sur orientation.tn',
                'Dépôt du dossier à l\'ISET Kairouan',
                'Passage du test d\'admission',
                'Résultats et affectation',
                'Inscription définitive'
            ],
            contact: {
                email: 'isetkairouan@kairouan.r-iset.tn',
                phone: '+216 77 123 456',
                address: 'Avenue Assad Ibn Fourat, Kairouan 3100'
            }
        }
    };
}
