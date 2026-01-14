import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    contact = { name: '', email: '', message: '' };
    isSubmitting = false;

    constructor(private dataService: DataService, private router: Router) { }

    ngOnInit(): void {
        this.initScrollAnimations();
    }

    initScrollAnimations(): void {
        if (typeof window !== 'undefined') {
            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animate-in'); });
            }, observerOptions);
            setTimeout(() => { document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el)); }, 100);
        }
    }

    onSubmit() {
        this.isSubmitting = true;
        this.dataService.sendContactMessage(this.contact).subscribe({
            next: () => {
                alert('Votre message a été envoyé avec succès à l\'administration de l\'ISET Kairouan.');
                this.contact = { name: '', email: '', message: '' };
                this.isSubmitting = false;
                this.router.navigate(['/']);
            },
            error: (err) => {
                console.error('Error sending message:', err);
                alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
                this.isSubmitting = false;
            }
        });
    }
}
