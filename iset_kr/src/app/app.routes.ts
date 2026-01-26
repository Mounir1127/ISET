import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { FormationsComponent } from './pages/formations/formations.component';
import { ServicesComponent } from './pages/services/services.component';
import { CertificationsComponent } from './pages/certifications/certifications.component';
import { FourCComponent } from './pages/4c/4c.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminLayoutComponent } from './pages/admin/layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users.component';
import { AdminAcademicComponent } from './pages/admin/academic/admin-academic.component';
import { AdminStructureComponent } from './pages/admin/structure/admin-structure.component';
import { AdminNewsComponent } from './pages/admin/news/admin-news.component';
import { AdminMessagesComponent } from './pages/admin/messages/admin-messages.component';
import { AdminSettingsComponent } from './pages/admin/settings/admin-settings.component';
import { AdminGalleryComponent } from './pages/admin/gallery/gallery.component';
import { StaffGuard } from './guards/staff.guard';
import { StaffLayoutComponent } from './pages/staff/layout/staff-layout.component';
import { NewsListingComponent } from './pages/news-listing/news-listing.component';

import { StudentGuard } from './guards/student.guard';
import { StudentLayoutComponent } from './pages/student/layout/student-layout.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    {
        path: 'departement/:id/enseignants',
        loadComponent: () => import('./pages/department-teachers/department-teachers.component').then(c => c.DepartmentTeachersComponent)
    },
    {
        path: 'enseignant/:id',
        loadComponent: () => import('./pages/teacher-profile/teacher-profile.component').then(c => c.TeacherProfileComponent)
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'forgot-password',
        loadComponent: () => import('./pages/login/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
    },
    { path: 'actualites', component: NewsListingComponent },
    {
        path: 'departement/:id',
        loadComponent: () => import('./pages/department-detail/department-detail.component').then(c => c.DepartmentDetailComponent)
    },

    {
        path: 'formations',
        component: FormationsComponent
    },
    {
        path: 'services',
        component: ServicesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'certifications',
        component: CertificationsComponent
    },
    {
        path: '4c',
        component: FourCComponent
    },

    {
        path: 'institut/mot-du-directeur',
        loadComponent: () => import('./pages/institut/mot-du-directeur/mot-du-directeur.component').then(c => c.MotDuDirecteurComponent)
    },
    {
        path: 'institut/presentation',
        loadComponent: () => import('./pages/institut/presentation/presentation.component').then(c => c.PresentationComponent)
    },
    {
        path: 'projets',
        loadComponent: () => import('./pages/projets/projets.component').then(c => c.ProjetsComponent)
    },
    {
        path: 'qualite',
        loadComponent: () => import('./pages/qualite/qualite.component').then(c => c.QualiteComponent)
    },
    {
        path: 'vie-universitaire',
        loadComponent: () => import('./pages/vie-estudiants/vie-estudiants.component').then(c => c.VieEstudiantsComponent)
    },
    { path: 'contact', component: ContactComponent },

    // Specialty Routes
    {
        path: 'specialite/dsi',
        loadComponent: () => import('./pages/specialties/specialty-dsi.component').then(c => c.SpecialtyDSIComponent)
    },
    {
        path: 'specialite/rsi',
        loadComponent: () => import('./pages/specialties/specialty-rsi.component').then(c => c.SpecialtyRSIComponent)
    },
    {
        path: 'specialite/aii',
        loadComponent: () => import('./pages/specialties/specialty-aii.component').then(c => c.SpecialtyAIIComponent)
    },
    {
        path: 'specialite/ei',
        loadComponent: () => import('./pages/specialties/specialty-ei.component').then(c => c.SpecialtyEIComponent)
    },
    {
        path: 'specialite/cfm',
        loadComponent: () => import('./pages/specialties/specialty-cfm.component').then(c => c.SpecialtyCFMComponent)
    },
    {
        path: 'specialite/mi',
        loadComponent: () => import('./pages/specialties/specialty-mi.component').then(c => c.SpecialtyMIComponent)
    },
    {
        path: 'specialite/comptabilite',
        loadComponent: () => import('./pages/specialties/specialty-comptabilite.component').then(c => c.SpecialtyComptabiliteComponent)
    },
    {
        path: 'specialite/management',
        loadComponent: () => import('./pages/specialties/specialty-management.component').then(c => c.SpecialtyManagementComponent)
    },

    // Student Routes
    {
        path: 'student',
        component: StudentLayoutComponent,
        canActivate: [StudentGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/student/dashboard/student-dashboard.component').then(c => c.StudentDashboardComponent)
            },
            {
                path: 'schedule',
                loadComponent: () => import('./pages/student/schedule/student-schedule.component').then(c => c.StudentScheduleComponent)
            },
            {
                path: 'grades',
                loadComponent: () => import('./pages/student/grades/student-grades.component').then(c => c.StudentGradesComponent)
            },
            {
                path: 'materials',
                loadComponent: () => import('./pages/student/materials/student-materials.component').then(c => c.StudentMaterialsComponent)
            },
            {
                path: 'rattrapage',
                loadComponent: () => import('./pages/student/rattrapage/rattrapage.component').then(c => c.RattrapageComponent)
            }
        ]
    },

    // Admin Routes
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AdminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'users', component: AdminUsersComponent },
            { path: 'academic', component: AdminAcademicComponent },
            { path: 'structure', component: AdminStructureComponent },
            { path: 'news', component: AdminNewsComponent },
            { path: 'messages', component: AdminMessagesComponent },
            { path: 'gallery', component: AdminGalleryComponent },
            {
                path: 'partners',
                loadComponent: () => import('./pages/admin/partners/admin-partners.component').then(c => c.AdminPartnersComponent)
            },
            {
                path: 'teachers',
                loadComponent: () => import('./pages/admin/teachers/admin-teachers.component').then(c => c.AdminTeachersComponent)
            },
            { path: 'settings', component: AdminSettingsComponent }
        ]
    },

    // Staff Routes
    {
        path: 'staff',
        component: StaffLayoutComponent,
        canActivate: [StaffGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/staff/dashboard/staff-dashboard.component').then(c => c.StaffDashboardComponent)
            },
            {
                path: 'students',
                loadComponent: () => import('./pages/staff/students/staff-students.component').then(c => c.StaffStudentsComponent)
            },
            {
                path: 'schedule',
                loadComponent: () => import('./pages/staff/schedule/staff-schedule.component').then(c => c.StaffScheduleComponent)
            },
            {
                path: 'materials',
                loadComponent: () => import('./pages/staff/materials/staff-materials.component').then(c => c.StaffMaterialsComponent)
            },
            {
                path: 'notes',
                loadComponent: () => import('./pages/staff/notes/staff-notes.component').then(c => c.StaffNotesComponent)
            },
            {
                path: 'announcements',
                loadComponent: () => import('./pages/staff/announcements/staff-announcements.component').then(c => c.StaffAnnouncementsComponent)
            },
            {
                path: 'claims',
                loadComponent: () => import('./pages/staff/claims/staff-claims.component').then(c => c.StaffClaimsComponent)
            },
            {
                path: 'rattrapage',
                loadComponent: () => import('./pages/staff/rattrapage/staff-rattrapage.component').then(c => c.StaffRattrapageComponent)
            }
        ]
    },

    { path: '**', redirectTo: '' }
];
