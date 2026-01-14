import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GalleryImage {
  _id?: string;
  url: string;
  caption?: string;
  category: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getImages(category: string): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.apiUrl}/public/gallery/${category}`);
  }

  uploadImage(formData: FormData): Observable<GalleryImage> {
    return this.http.post<GalleryImage>(`${this.apiUrl}/admin/gallery/upload`, formData);
  }

  deleteImage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/gallery/${id}`);
  }
}
