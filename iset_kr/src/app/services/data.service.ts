import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { delay, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;
  private refreshAnnouncements$ = new Subject<void>();

  get refreshAnnouncementsRequested$() {
    return this.refreshAnnouncements$.asObservable();
  }

  constructor(private http: HttpClient) { }

  getImageUrl(path: string | null | undefined, name: string = 'User'): string {
    if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
    if (path.startsWith('http')) return path;
    if (path.startsWith('assets/')) return '/' + path;

    // If apiUrl is relative (starts with /), ensure we don't end up with //
    const baseUrl = this.apiUrl.replace('/api', '');
    const fullPath = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    return fullPath;
  }

  notifyAnnouncementsChanged() {
    this.refreshAnnouncements$.next();
  }

  getServices() {
    return of([
      {
        id: 1,
        icon: 'fas fa-graduation-cap',
        title: 'Formations Innovantes',
        description: 'Des programmes académiques conçus pour répondre aux besoins du marché et aux défis technologiques actuels.'
      },
      {
        id: 2,
        icon: 'fas fa-flask',
        title: 'Laboratoires de Recherche',
        description: 'Des installations modernes pour la recherche appliquée et l\'expérimentation technologique.'
      },
      {
        id: 3,
        icon: 'fas fa-handshake',
        title: 'Partenariats Industriels',
        description: 'Collaborations avec des entreprises leaders pour des stages et des opportunités professionnelles.'
      }
    ]);
  }

  getCertificates() {
    return of([
      {
        id: 1,
        title: 'Système de Management de la Qualité',
        standard: 'ISO 9001:2015',
        description: 'Cette certification atteste de l\'engagement de l\'ISET Kairouan à fournir des services éducatifs de haute qualité.',
        issuedDate: '15 Mars 2023',
        badge: 'SMG'
      },
      {
        id: 2,
        title: 'Système de Management des Organisations Éducatives',
        standard: 'ISO 21001:2018',
        description: 'Cette certification garantit des processus efficaces pour répondre aux besoins des apprenants.',
        issuedDate: '10 Juillet 2024',
        badge: 'SMG'
      }
    ]);
  }

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/public/departments`);
  }

  getAnnouncements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/announcements`).pipe(
      timeout(10000),
      catchError((error) => {
        console.error('DataService: Error fetching announcements', error);
        return of([]);
      })
    );
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`).pipe(
      catchError(() => of({
        students: 1122,
        teachers: 99,
        departments: 6,
        modules: 120,
        labs: 12,
        certifications: 2,
        partners: 25
      }))
    );
  }

  sendContactMessage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/public/contact`, data);
  }

  // Admin Contact Management
  getAdminContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/contacts`);
  }

  markContactAsRead(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/contacts/${id}/read`, {});
  }

  deleteContactMessage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/contacts/${id}`);
  }

  // Admin User Management
  getAdminUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/users/${id}`, data);
  }

  createAdminUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/users`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/users/${id}`);
  }

  uploadProfileImage(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<any>(`${this.apiUrl}/admin/users/${id}/profile-image`, formData);
  }

  // Teachers
  getTeachersByDepartment(deptId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/public/teachers/department/${deptId}`);
  }

  getTeacherById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/public/teachers/${id}`);
  }

  // Partners
  getPartners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/partners`);
  }
}
