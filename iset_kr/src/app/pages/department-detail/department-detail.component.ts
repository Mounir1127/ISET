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
        route?: string;
        pdf?: string;
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
    teachers: any[] = [];
    private deptCodeMap: { [key: string]: string } = {
        'informatique': 'TI',
        'genie-electrique': 'GE',
        'genie-mecanique': 'GM',
        'gestion': 'GESTION'
    };

    // Mock data for departments
    departmentsData: { [key: string]: DepartmentData } = {
        'informatique': {
            id: 'informatique',
            name: 'Technologies de l\'Informatique',
            icon: 'fa-laptop-code',
            heroImage: '/assets/images/images_iset/image11.jpg',
            description: 'Le département des Technologies de l\'Informatique (TI) forme des experts capables de répondre aux défis de la transformation numérique. Nos programmes d\'excellence couvrent le développement logiciel, l\'administration réseaux, la cybersécurité et les systèmes embarqués.',
            stats: [
                { label: 'Étudiants', value: '450+' },
                { label: 'Enseignants', value: '42' },
                { label: 'Laboratoires', value: '12' },
                { label: 'Projets', value: '85' }
            ],
            headOfDepartment: {
                name: 'Mme. Kawthar Mtawaa',
                role: 'Chef de Département',
                image: '',
                message: 'Bienvenue au département TI. Notre mission est de former les futurs leaders du monde numérique par une pédagogie active et des partenariats industriels forts.'
            },
            specialties: [
                {
                    name: 'Développement des Systèmes d\'Information (DSI)',
                    description: 'Conception et réalisation d\'applications d\'entreprise, web et mobiles.',
                    icon: 'fa-code',
                    route: 'dsi',
                    pdf: '/assets/department-detail/DSI RSI SEM.pdf'
                },
                {
                    name: 'Réseaux et Services Informatiques (RSI)',
                    description: 'Gestion des infrastructures, cloud computing et sécurité réseaux.',
                    icon: 'fa-network-wired',
                    route: 'rsi',
                    pdf: '/assets/department-detail/DSI RSI SEM.pdf'
                }
            ],
            labs: ['Laboratoire Cloud & DevOps', 'Cisco Networking Academy', 'Labo Développement Mobile', 'Cybersécurité & IoT', 'Labo IA']
        },
        'genie-electrique': {
            id: 'genie-electrique',
            name: 'Génie Électrique',
            icon: 'fa-bolt',
            heroImage: '/assets/images/elec.jpg',
            description: 'Le département Génie Électrique est un pôle d\'excellence formant des techniciens supérieurs en électricité, électronique et automatisme. Nous préparons nos étudiants aux défis de l\'industrie 4.0.',
            stats: [
                { label: 'Étudiants', value: '203' },
                { label: 'Enseignants', value: '30' },
                { label: 'Laboratoires', value: '10' },
                { label: 'Projets Ind.', value: '25+' }
            ],
            headOfDepartment: {
                name: 'Mr. Mourad Selmi',
                role: 'Chef de Département',
                image: '',
                message: 'Le Génie Électrique est le moteur de l\'innovation technologique. Nous formons des techniciens supérieurs experts pour l\'industrie 4.0.'
            },
            specialties: [
                {
                    name: 'Automatismes et Informatique Industrielle (AII)',
                    description: 'La filière Automatismes et Informatique Industrielle (AII) forme des spécialistes capables de concevoir, superviser et optimiser les systèmes automatisés et les processus industriels en intégrant l\'informatique, l\'électronique et la robotique.',
                    icon: 'fa-robot',
                    route: 'aii',
                    pdf: '/assets/department-detail/AII.pdf'
                },
                {
                    name: 'Électricité Industrielle (EI)',
                    description: 'La filière Électricité Industrielle (EI) forme des licences capables de concevoir, installer, maintenir et optimiser les systèmes électriques et automatisés dans les environnements industriels.',
                    icon: 'fa-plug',
                    route: 'ei',
                    pdf: '/assets/department-detail/EI.pdf'
                }
            ],
            labs: ['Labo Automatisme', 'Labo Électronique de Puissance', 'Atelier Maintenance', 'Schneider Electric Lab']
        },
        'genie-mecanique': {
            id: 'genie-mecanique',
            name: 'Génie Mécanique',
            icon: 'fa-cogs',
            heroImage: '/assets/images/meca.jpg',
            description: 'Le département Génie Mécanique offre une formation solide en conception, fabrication et maintenance des systèmes mécaniques. Nos étudiants maîtrisent la CAO/DAO et les procédés de fabrication modernes.',
            stats: [
                { label: 'Étudiants', value: '220' },
                { label: 'Enseignants', value: '28' },
                { label: 'Ateliers', value: '6' },
                { label: 'Machines CNC', value: '15' }
            ],
            headOfDepartment: {
                name: 'Mr. Nizar Ouni',
                role: 'Chef de Département',
                image: '',
                message: 'L\'excellence mécanique passe par la maîtrise de la conception et de la production. Bienvenue au département Génie Mécanique.'
            },
            specialties: [
                {
                    name: 'Construction et Fabrication Mécanique (CFM)',
                    description: 'Conception assistée par ordinateur et usinage numérique.',
                    icon: 'fa-tools',
                    route: 'cfm'
                },
                {
                    name: 'Maintenance Industrielle (MI)',
                    description: 'Gestion de la maintenance et fiabilité des équipements.',
                    icon: 'fa-wrench',
                    route: 'mi'
                }
            ],
            labs: ['Atelier Usinage', 'Labo Métrologie', 'Bureau d\'études CAO', 'Soudage & Chaudronnerie']
        },
        'gestion': {
            id: 'gestion',
            name: 'Sciences Économiques & Gestion',
            icon: 'fa-chart-line',
            heroImage: '/assets/images/images_iset/image12.jpg',
            description: 'Ce département forme les futurs cadres gestionnaires. Nos programmes allient théorie économique et pratiques managériales pour une insertion rapide dans le monde des affaires.',
            stats: [
                { label: 'Étudiants', value: '405' },
                { label: 'Enseignants', value: '40' },
                { label: 'Clubs', value: '5' },
                { label: 'Partenaires', value: '20' }
            ],
            headOfDepartment: {
                name: 'Mr. Chokri Ouertani',
                role: 'Chef de Département',
                image: '',
                message: 'Les sciences de gestion sont au cœur de la performance des organisations. Nous préparons les managers de demain à relever les défis du monde des affaires.'
            },
            specialties: [
                {
                    name: 'Comptabilité et Finances',
                    description: 'Gestion financière, audit et contrôle de gestion.',
                    icon: 'fa-file-invoice-dollar',
                    route: 'comptabilite'
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

    constructor(private route: ActivatedRoute, public dataService: DataService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            window.scrollTo(0, 0);
            this.departmentId = params.get('id');
            if (this.departmentId && this.departmentsData[this.departmentId]) {
                this.department = this.departmentsData[this.departmentId];

                // Fetch teachers for the department
                this.dataService.getTeachersByDepartment(this.departmentId).subscribe({
                    next: (teachers) => {
                        this.teachers = teachers.slice(0, 5);
                        this.cdr.markForCheck();
                    },
                    error: (err) => console.error('Error loading teachers', err)
                });

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
                                    image: this.dataService.getImageUrl(matchingRealDept.headOfDepartment.profileImage, matchingRealDept.headOfDepartment.name),
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
