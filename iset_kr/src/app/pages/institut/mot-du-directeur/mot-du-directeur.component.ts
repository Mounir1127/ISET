import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-mot-du-directeur',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './mot-du-directeur.component.html',
    styleUrl: './mot-du-directeur.component.scss'
})
export class MotDuDirecteurComponent implements OnInit {

    ngOnInit(): void {
        this.initScrollAnimations();
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
            }, 100);
        }
    }
}
