import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService, GalleryImage } from '../../../services/gallery.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class AdminGalleryComponent implements OnInit {
  images: GalleryImage[] = [];
  selectedFile: File | null = null;
  caption: string = '';
  category: string = 'student_life';
  isUploading = false;
  apiUrl = environment.apiUrl.replace('/api', '');

  constructor(private galleryService: GalleryService) { }

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.galleryService.getImages(this.category).subscribe({
      next: (images) => this.images = images,
      error: (err) => console.error('Error:', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('caption', this.caption);
    formData.append('category', this.category);

    this.galleryService.uploadImage(formData).subscribe({
      next: (img) => {
        this.images.unshift(img);
        this.isUploading = false;
        this.selectedFile = null;
        this.caption = '';
        // Clear file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.isUploading = false;
      }
    });
  }

  deleteImage(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette image ?')) {
      this.galleryService.deleteImage(id).subscribe({
        next: () => {
          this.images = this.images.filter(img => img._id !== id);
        },
        error: (err) => console.error('Delete error:', err)
      });
    }
  }

  getImageUrl(url: string): string {
    if (url.startsWith('assets/')) return url;
    return `${this.apiUrl}${url}`;
  }
}
