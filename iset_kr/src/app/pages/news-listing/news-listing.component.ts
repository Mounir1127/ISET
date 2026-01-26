import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router'; // Added ActivatedRoute
import { DataService } from '../../services/data.service';
import { Subscription, delay, of } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

@Component({
  selector: 'app-news-listing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="news-list-page">
      <!-- HERO -->
      <section class="news-hero-dark">
        <div class="container">
          <h1 class="hero-title-main animate-fade-in">Actualités</h1>
        </div>
      </section>

      <!-- BARRE DE FILTRE -->
      <div class="filter-wrapper">
        <div class="container">
          <div class="pro-filter-bar">
            <div class="tabs-modern">
              <button [class.active]="activeTab === 'all'" (click)="setFilter('all')">TOUT</button>
              <button [class.active]="activeTab === 'news'" (click)="setFilter('news')">ACTUALITÉS</button>
              <button [class.active]="activeTab === 'event'" (click)="setFilter('event')">MANIFESTATIONS</button>
              <button [class.active]="activeTab === 'tender'" (click)="setFilter('tender')">APPELS D'OFFRE</button>
            </div>
            <div class="search-box-pro">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Rechercher..." (input)="onSearch($event)">
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION CONTENU -->
      <section class="news-grid-section">
        <div class="container">
          
          <!-- LE SPINNER (S'affiche uniquement si isLoading est true) -->
          <div class="loading-state-center" *ngIf="isLoading">
            <div class="iset-spinner-fix"></div>
            <p>Chargement des données en cours...</p>
          </div>

          <!-- LA GRILLE (S'affiche uniquement si isLoading est false) -->
          <ng-container *ngIf="!isLoading">
            <div class="news-grid-iset" *ngIf="filteredItems.length > 0">
              <article class="iset-card animate-fade-up" *ngFor="let item of filteredItems" (click)="openDetails(item)">
                <div class="iset-card-image">
                  <img [src]="item.image || 'assets/bg-hero.jpg'" [alt]="item.title">
                  <div class="iset-date-badge" *ngIf="item.publishDate">
                    {{ item.publishDate | date:'EEEE dd MMMM yyyy' : '' : 'fr' | uppercase }}
                  </div>
                </div>
                
                <div class="iset-card-content">
                  <h3 class="iset-card-title">{{ item.title }}</h3>
                  <p class="iset-card-desc">{{ item.description || item.summary || "Plus de détails sur cette publication de l'ISET Kairouan." }}</p>
                  
                  <div class="iset-card-footer">
                    <span class="plus-info">PLUS D'INFORMATIONS</span>
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </div>
              </article>
            </div>

            <!-- ÉTAT VIDE -->
            <div class="empty-state animate-fade-in" *ngIf="filteredItems.length === 0">
              <i class="fas fa-newspaper-slash"></i>
              <p>Aucune actualité trouvée pour cette catégorie.</p>
            </div>
          </ng-container>

        </div>
      </section>

      <!-- MODAL DETAILS -->
      <div class="modal-overlay" *ngIf="selectedAnnouncement" (click)="closeDetails()">
        <div class="modal-content-pro" (click)="$event.stopPropagation()">
          <button class="close-btn-pro" (click)="closeDetails()"><i class="fas fa-times"></i></button>
          
          <div class="modal-hero-img" [style.background-image]="'url(' + (selectedAnnouncement.image || 'assets/bg-hero.jpg') + ')'">
            <div class="modal-date-badge" *ngIf="selectedAnnouncement.publishDate">
              {{ selectedAnnouncement.publishDate | date:'dd MMM yyyy' : '' : 'fr' | uppercase }}
            </div>
          </div>

          <div class="modal-body-pro">
            <div class="modal-tags mb-3">
              <span class="tag-pill" [ngClass]="selectedAnnouncement.type">{{ selectedAnnouncement.type | uppercase }}</span>
            </div>
            
            <h2 class="modal-title">{{ selectedAnnouncement.title }}</h2>
            
            <div class="modal-text-content">
              <p>{{ selectedAnnouncement.description || selectedAnnouncement.summary }}</p>
              
              <!-- Content fallback if it's long text -->
              <div *ngIf="selectedAnnouncement.content" [innerHTML]="selectedAnnouncement.content" class="rich-text"></div>
            </div>

            <div class="modal-actions mt-4" *ngIf="selectedAnnouncement.link">
               <a [href]="selectedAnnouncement.link" target="_blank" class="btn-action-primary">
                 Voir le lien original <i class="fas fa-external-link-alt ms-2"></i>
               </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&display=swap');

    .news-list-page { background: #f8fafc; min-height: 100vh; font-family: 'Outfit', sans-serif; }
    .container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }

    .news-hero-dark { background: #0f172a; height: 350px; display: flex; align-items: center; position: relative; }
    .hero-title-main { font-size: 5rem; font-weight: 900; color: white; margin: 0; letter-spacing: -2px; }

    .filter-wrapper { margin-top: -40px; position: relative; z-index: 10; }
    .pro-filter-bar {
      background: white; padding: 0.8rem 1.5rem; border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;
    }

    .tabs-modern button {
      background: none; border: none; padding: 0.8rem 1.2rem;
      font-weight: 700; color: #94a3b8; cursor: pointer;
      transition: 0.3s; font-size: 0.8rem; letter-spacing: 1px;
    }
    .tabs-modern button.active { color: #0f172a; border-bottom: 3px solid #f59e0b; }

    .search-box-pro { position: relative; }
    .search-box-pro i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #f59e0b; }
    .search-box-pro input {
      padding: 0.7rem 1rem 0.7rem 2.8rem; border-radius: 8px; border: 1px solid #f1f5f9;
      background: #f8fafc; width: 250px; font-weight: 600; transition: 0.3s;
    }

    .news-grid-section { padding: 5rem 0; min-height: 500px; }
    
    /* --- SPINNER FIX --- */
    .loading-state-center {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 8rem 0; color: #64748b; font-weight: 600; gap: 1.5rem;
    }

    .iset-spinner-fix {
      width: 60px; height: 60px;
      border: 4px solid rgba(15, 23, 42, 0.1);
      border-top: 4px solid #f59e0b;
      border-radius: 50%;
      animation: spin-iset 1s linear infinite;
    }

    @keyframes spin-iset { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .news-grid-iset { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 40px; }
    
    .iset-card {
      background: white; border-radius: 4px; overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.03); transition: all 0.4s ease;
      display: flex; flex-direction: column;
    }
    .iset-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); border-top: 3px solid #f59e0b; }

    .iset-card-image { height: 350px; position: relative; overflow: hidden; }
    .iset-card-image img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
    .iset-card:hover .iset-card-image img { transform: scale(1.05); }

    .iset-date-badge {
      position: absolute; bottom: 0; left: 0; background: #f59e0b;
      color: white; padding: 0.6rem 1.5rem; font-weight: 800; font-size: 0.75rem;
    }

    .iset-card-content { padding: 2.5rem; flex: 1; display: flex; flex-direction: column; }
    .iset-card-title { font-size: 1.6rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; }
    .iset-card-desc { font-size: 0.95rem; color: #64748b; line-height: 1.6; margin-bottom: 2rem; }
    .iset-card-footer { margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
    .iset-card-footer .plus-info { font-size: 0.75rem; font-weight: 800; color: #94a3b8; }
    
    .empty-state { text-align: center; padding: 5rem 0; color: #94a3b8; }
    .empty-state i { font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.2; }

    .animate-fade-in { animation: fadeIn 0.8s ease-out; }
    .animate-fade-up { animation: fadeUp 0.8s ease-out both; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    /* --- MODAL PRO STYLES --- */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px);
      z-index: 9999; display: flex; align-items: center; justify-content: center;
      animation: modalFadeIn 0.3s ease-out;
      padding: 1rem;
    }

    .modal-content-pro {
      background: white; width: 100%; max-width: 800px;
      border-radius: 20px; overflow: hidden; position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      max-height: 90vh; overflow-y: auto;
    }

    .close-btn-pro {
      position: absolute; top: 1rem; right: 1rem; z-index: 10;
      background: rgba(255, 255, 255, 0.9); border: none;
      width: 40px; height: 40px; border-radius: 50%;
      color: #0f172a; font-size: 1.2rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .close-btn-pro:hover { transform: scale(1.1); background: white; color: #ef4444; }

    .modal-hero-img {
      height: 300px; background-size: cover; background-position: center;
      position: relative;
    }
    .modal-date-badge {
      position: absolute; bottom: 1.5rem; left: 2rem;
      background: rgba(15, 23, 42, 0.9); color: #f59e0b;
      padding: 0.5rem 1rem; border-radius: 8px; font-weight: 800;
      font-size: 0.85rem; letter-spacing: 1px;
      backdrop-filter: blur(4px);
    }

    .modal-body-pro { padding: 3rem; }
    .modal-tags { margin-bottom: 1.5rem; }
    .tag-pill {
      display: inline-block; padding: 0.4rem 1rem; border-radius: 50px;
      font-size: 0.75rem; font-weight: 800; letter-spacing: 1px;
    }
    .tag-pill.news { background: #eff6ff; color: #3b82f6; }
    .tag-pill.event { background: #fffbeb; color: #d97706; }
    .tag-pill.tender { background: #f0fdf4; color: #16a34a; }

    .modal-title { font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 2rem; line-height: 1.1; }
    
    .modal-text-content { 
      font-size: 1.1rem; line-height: 1.8; color: #334155; 
      margin-bottom: 2rem; 
    }
    .modal-text-content p { margin-bottom: 1.5rem; }
    
    .btn-action-primary {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: #0f172a; color: white; padding: 1rem 2rem;
      border-radius: 12px; font-weight: 700; text-decoration: none;
      transition: 0.3s;
    }
    .btn-action-primary:hover { background: #1e293b; transform: translateY(-2px); }

    @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .modal-hero-img { height: 200px; }
      .modal-body-pro { padding: 2rem; }
      .modal-title { font-size: 1.8rem; }
    }
  `]
})
export class NewsListingComponent implements OnInit, OnDestroy {
  allItems: any[] = [];
  filteredItems: any[] = [];
  activeTab = 'all';
  searchTerm = '';
  isLoading = true;
  private routerSub: Subscription | null = null;
  private safetyTimeout: any;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute // Injected ActivatedRoute
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    // Initial check for query params
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.activeTab = tab;
      }
      // Load data after setting tab to ensure filters apply correctly
      this.loadData();
    });

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && (event.urlAfterRedirects === '/actualites' || event.url === '/actualites')) {
        // Re-read params on navigation end if needed, but the route sub above usually handles it.
        // Keeping loadData here might be redundant if route param changes trigger the above sub.
        // Ideally, we depend on route params.
      }
    });

    // SÉCURITÉ : Forcer la disparition du loader après 6 secondes max
    this.safetyTimeout = setTimeout(() => {
      if (this.isLoading) {
        console.warn('Safety timeout reached for loader.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 6000);
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.safetyTimeout) clearTimeout(this.safetyTimeout);
  }

  loadData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.dataService.getAnnouncements()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
        catchError(err => {
          console.error('Data Load Error:', err);
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.allItems = [];
          if (data && data.length > 0) {
            this.allItems = data.map((item: any) => {
              let type = item.type?.toLowerCase() || 'news';
              if (type.includes('actu') || type === 'academic') type = 'news';
              if (type.includes('mani') || type.includes('even')) type = 'event';
              if (type.includes('appel') || type.includes('offr') || type === 'administrative') type = 'tender';
              return { ...item, type };
            }).sort((a: any, b: any) => {
              const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
              const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
              return dateB - dateA;
            });
          }
          this.applyFilters();
        }
      });
  }

  setFilter(type: string): void {
    this.activeTab = type;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  onSearch(event: any): void {
    this.searchTerm = (event.target.value || '').toLowerCase();
    this.applyFilters();
    this.cdr.detectChanges();
  }

  applyFilters(): void {
    this.filteredItems = (this.allItems || []).filter(item => {
      const matchesTab = this.activeTab === 'all' || item.type === this.activeTab;
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || item.summary || '').toLowerCase();
      const matchesSearch = !this.searchTerm || title.includes(this.searchTerm) || desc.includes(this.searchTerm);
      return matchesTab && matchesSearch;
    });
  }

  openDetails(item: any): void {
    this.selectedAnnouncement = item;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeDetails(): void {
    this.selectedAnnouncement = null;
    document.body.style.overflow = 'auto';
  }

  selectedAnnouncement: any = null;
}
