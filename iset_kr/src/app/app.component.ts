import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ISET Kairouan';
  currentUser: any = null;
  isAdminRoute = false;
  isMenuOpen = false;

  isLoginPage = false;
  isContactPage = false;
  isFormationsPage = false;
  isCertificationsPage = false;
  isFourCPage = false;
  isMotDirecteurPage = false;
  isPresentationPage = false;
  isDepartmentPage = false;
  isProjetsPage: boolean = false;
  isVieEtudiantePage: boolean = false;
  isQualitePage = false; // Added isQualitePage
  activeSubMenu: string | null = null;
  activeSubSubMenu: string | null = null;

  // Added properties for user roles, assuming they are needed based on the provided constructor snippet
  isAdmin: boolean = false;
  isStaff: boolean = false;
  isStudent: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService, // Changed to public as it was public in original
    private renderer: Renderer2 // Added Renderer2
  ) {
    // Moved and modified authService subscription
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin';
      this.isStaff = user?.role === 'staff';
      this.isStudent = user?.role === 'student';
    });

    // Modified router events subscription
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAdminRoute = this.router.url.startsWith('/admin') || this.router.url.startsWith('/staff'); // Kept original logic for staff
        this.isLoginPage = this.router.url === '/login';
        this.isContactPage = this.router.url === '/contact';
        this.isFormationsPage = this.router.url === '/formations';
        this.isCertificationsPage = this.router.url === '/certifications';
        this.isFourCPage = this.router.url === '/4c';
        this.isMotDirecteurPage = this.router.url.includes('/mot-du-directeur');
        this.isPresentationPage = this.router.url.includes('/presentation');
        this.isPresentationPage = this.router.url.includes('/presentation');
        this.isDepartmentPage = this.router.url.includes('/department/') || this.router.url.includes('/departement/');
        this.isProjetsPage = this.router.url.includes('/projets');
        this.isProjetsPage = this.router.url.includes('/projets');
        this.isVieEtudiantePage = this.router.url.includes('/vie-universitaire');
        this.isQualitePage = this.router.url.includes('/qualite'); // Added isQualitePage logic
        this.isMenuOpen = false;
        this.closeMenu(); // Added closeMenu()
        window.scrollTo(0, 0); // Added window.scrollTo(0, 0)
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.activeSubMenu = null;
    this.activeSubSubMenu = null;
  }

  selectSubMenu(menu: string) {
    if (this.activeSubMenu === menu) {
      this.activeSubMenu = null;
      this.activeSubSubMenu = null;
    } else {
      this.activeSubMenu = menu;
      this.activeSubSubMenu = null;
    }
  }

  selectSubSubMenu(menu: string) {
    if (this.activeSubSubMenu === menu) {
      this.activeSubSubMenu = null;
    } else {
      this.activeSubSubMenu = menu;
    }
  }

  ngOnInit() {
    this.authService.checkAuthStatus();
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
    }
  }

  openStudentSpace() {
    window.open('https://isetkairouan.edx.tn/login.faces', '_blank', 'noopener,noreferrer');
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
