import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GalleryService, GalleryImage } from '../../services/gallery.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-vie-estudiants',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vie-estudiants.component.html',
  styleUrls: ['./vie-estudiants.component.scss']
})
export class VieEstudiantsComponent implements OnInit {

  apiUrl = environment.apiUrl.replace('/api', ''); // Base URL for static files if needed

  clubs = [
    {
      name: 'Club Robotique',
      icon: 'fas fa-robot',
      description: 'Conception et réalisation de prototypes robotiques pour les compétitions nationales.'
    },
    {
      name: 'Club Informatique',
      icon: 'fas fa-code',
      description: 'Développement web, mobile et initiation à la cybersécurité.'
    },
    {
      name: 'Club Culturel',
      icon: 'fas fa-palette',
      description: 'Théâtre, musique et arts plastiques pour l\'épanouissement des talents.'
    },
    {
      name: 'Club Sportif',
      icon: 'fas fa-running',
      description: 'Tournois inter-ISET et activités physiques régulières.'
    }
  ];

  galleryImages: GalleryImage[] = [];
  selectedImage: GalleryImage | null = null;

  constructor(
    private galleryService: GalleryService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Vie Universitaire - ISET Kairouan');
    this.loadImages();
    this.initScrollAnimations();
    window.scrollTo(0, 0);
  }

  openImage(image: GalleryImage) {
    this.selectedImage = image;
    document.body.style.overflow = 'hidden';
  }

  closeImage() {
    this.selectedImage = null;
    document.body.style.overflow = '';
  }

  loadImages() {
    this.galleryService.getImages('student_life').subscribe({
      next: (images) => {
        this.galleryImages = images;
        // Wait for DOM update
        setTimeout(() => this.initScrollAnimations(), 100);
      },
      error: (err) => console.error('Error loading gallery:', err)
    });
  }

  getImageUrl(url: string): string {
    if (url.startsWith('assets/')) return url;
    return `${this.apiUrl}${url}`;
  }

  private initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }
}
