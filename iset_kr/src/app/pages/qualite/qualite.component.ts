import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-qualite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qualite.component.html',
  styleUrls: ['./qualite.component.scss']
})
export class QualiteComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Management Qualité - ISET Kairouan');
    this.initScrollAnimations();
    window.scrollTo(0, 0);
  }

  private initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }
}
