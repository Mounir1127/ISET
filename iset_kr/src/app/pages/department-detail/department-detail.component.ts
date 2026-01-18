import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

interface DepartmentData {
    id: string;
    name: string;
    icon: string;
    heroImage: string;
    description: string;
    stats: { label: string; value: string }[];
    headOfDepartment: {
        name: string;
        role: string;
        image: string;
        message: string;
    };
    specialties: {
        name: string;
        description: string;
        icon: string;
    }[];
    labs: string[];
}

@Component({
    selector: 'app-department-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './department-detail.component.html',
    styleUrls: ['./department-detail.component.scss']
})
export class DepartmentDetailComponent implements OnInit {
    departmentId: string | null = null;
    department: DepartmentData | undefined;
    private deptCodeMap: { [key: string]: string } = {
        'technologie-informatique': 'TI',
        'genie-electrique': 'GE',
        'genie-mecanique': 'GM',
        'gestion': 'GESTION'
    };

    // Mock data for departments
    departmentsData: { [key: string]: DepartmentData } = {
        'technologie-informatique': {
            id: 'technologie-informatique',
            name: 'Département Technologie Informatique',
            icon: 'fa-laptop-code',
            heroImage: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1920&q=80',
            description: 'Le département Technologie Informatique forme des experts en technologies numériques, capables de concevoir, développer et sécuriser des systèmes d\'information complexes. Nos programmes couvrent le développement logiciel, les systèmes embarqués, et l\'administration des systèmes.',
            stats: [
                { label: 'Étudiants', value: '254' },
                { label: 'Enseignants', value: '35' },
                { label: 'Laboratoires', value: '8' },
                { label: 'Partenaires', value: '12' }
            ],
            headOfDepartment: {
                name: 'Chargement...',
                role: 'Chef de Département',
                image: 'assets/images/staff/generic-avatar.png',
                message: ''
            },
            specialties: [
                {
                    name: 'Développement des Systèmes d\'Information (DSI)',
                    description: 'Conception et développement d\'applications web, mobiles et desktop.',
                    icon: 'fa-code'
                },
                {
                    name: 'Réseaux et Services Informatiques (RSI)',
                    description: 'Gestion des infrastructures réseaux et sécurité des systèmes.',
                    icon: 'fa-network-wired'
                }
            ],
            labs: ['Laboratoire IA & Big Data', 'Cisco Academy', 'Microsoft Club', 'Cyber Security Lab']
        },
        'genie-electrique': {
            id: 'genie-electrique',
            name: 'Génie Électrique',
            icon: 'fa-bolt',
            heroImage: 'assets/images/images_iset/1629_1.JPG',
            description: 'Le département Génie Électrique est un pôle d\'excellence formant des techniciens supérieurs en électricité, électronique et automatisme. Nous préparons nos étudiants aux défis de l\'industrie 4.0.',
            stats: [
                { label: 'Étudiants', value: '203' },
                { label: 'Enseignants', value: '30' },
                { label: 'Laboratoires', value: '10' },
                { label: 'Projets Ind.', value: '25+' }
            ],
            headOfDepartment: {
                name: 'Chargement...',
                role: 'Chef de Département',
                image: 'assets/images/staff/generic-avatar.png',
                message: ''
            },
            specialties: [
                {
                    name: 'Automatismes et Informatique Industrielle (AII)',
                    description: 'La filière Automatismes et Informatique Industrielle (AII) forme des spécialistes capables de concevoir, superviser et optimiser les systèmes automatisés et les processus industriels en intégrant l\'informatique, l\'électronique et la robotique.',
                    icon: 'fa-robot'
                },
                {
                    name: 'Électricité Industrielle (EI)',
                    description: 'La filière Électricité Industrielle (EI) forme des licences capables de concevoir, installer, maintenir et optimiser les systèmes électriques et automatisés dans les environnements industriels.',
                    icon: 'fa-plug'
                }
            ],
            labs: ['Labo Automatisme', 'Labo Électronique de Puissance', 'Atelier Maintenance', 'Schneider Electric Lab']
        },
        'genie-mecanique': {
            id: 'genie-mecanique',
            name: 'Génie Mécanique',
            icon: 'fa-cogs',
            heroImage: 'assets/images/images_iset/BD34_1.JPG',
            description: 'Le département Génie Mécanique offre une formation solide en conception, fabrication et maintenance des systèmes mécaniques. Nos étudiants maîtrisent la CAO/DAO et les procédés de fabrication modernes.',
            stats: [
                { label: 'Étudiants', value: '220' },
                { label: 'Enseignants', value: '28' },
                { label: 'Ateliers', value: '6' },
                { label: 'Machines CNC', value: '15' }
            ],
            headOfDepartment: {
                name: 'Chargement...',
                role: 'Chef de Département',
                image: 'assets/images/staff/generic-avatar.png',
                message: ''
            },
            specialties: [
                {
                    name: 'Construction et Fabrication Mécanique (CFM)',
                    description: 'Conception assistée par ordinateur et usinage numérique.',
                    icon: 'fa-tools'
                },
                {
                    name: 'Maintenance Industrielle (MI)',
                    description: 'Gestion de la maintenance et fiabilité des équipements.',
                    icon: 'fa-wrench'
                }
            ],
            labs: ['Atelier Usinage', 'Labo Métrologie', 'Bureau d\'études CAO', 'Soudage & Chaudronnerie']
        },
        'gestion': {
            id: 'gestion',
            name: 'Sciences Économiques & Gestion',
            icon: 'fa-chart-line',
            heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
            description: 'Ce département forme les futurs cadres gestionnaires. Nos programmes allient théorie économique et pratiques managériales pour une insertion rapide dans le monde des affaires.',
            stats: [
                { label: 'Étudiants', value: '405' },
                { label: 'Enseignants', value: '40' },
                { label: 'Clubs', value: '5' },
                { label: 'Partenaires', value: '20' }
            ],
            headOfDepartment: {
                name: 'Chargement...',
                role: 'Chef de Département',
                image: 'assets/images/staff/generic-avatar.png',
                message: ''
            },
            specialties: [
                {
                    name: 'Comptabilité et Finances',
                    description: 'Gestion financière, audit et contrôle de gestion.',
                    icon: 'fa-file-invoice-dollar'
                },
                {
                    name: 'Marketing et Commerce International',
                    description: 'Stratégies commerciales et échanges mondiaux.',
                    icon: 'fa-globe-africa'
                },
                {
                    name: 'Administration des Affaires',
                    description: 'Gestion des ressources humaines et management stratégique.',
                    icon: 'fa-user-tie'
                }
            ],
            labs: ['Club Entrepreneuriat', 'Salle des Marchés (Simulateur)', 'Incubateur Junior']
        }
    };

    constructor(private route: ActivatedRoute, private dataService: DataService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            window.scrollTo(0, 0);
            this.departmentId = params.get('id');
            if (this.departmentId && this.departmentsData[this.departmentId]) {
                this.department = this.departmentsData[this.departmentId];

                // Attempt to update with real data from backend
                this.dataService.getDepartments().subscribe(realDepts => {
                    if (this.departmentId) {
                        const targetCode = this.deptCodeMap[this.departmentId || ''];
                        const matchingRealDept = realDepts.find(d => {
                            const dbCode = (d.code || '').toUpperCase();
                            return dbCode === targetCode;
                        });

                        if (matchingRealDept && matchingRealDept.headOfDepartment) {
                            this.department = {
                                ...this.department!,
                                headOfDepartment: {
                                    name: matchingRealDept.headOfDepartment.name,
                                    role: matchingRealDept.headOfDepartment.grade || 'Chef de Département',
                                    image: matchingRealDept.headOfDepartment.profileImage || 'assets/images/staff/generic-avatar.png',
                                    message: matchingRealDept.headOfDepartment.bio || this.department!.headOfDepartment.message
                                }
                            };
                            this.cdr.markForCheck();
                        }
                    }
                });

                this.initScrollAnimations();
            }
        });
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
            }, 300);
        }
    }

    private normalize(str: string): string {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
