import { NgIf } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef, private authService: LoginService) {

  }

  sesionIniciada(): boolean {
    return this.authService.isAuthenticated();
  }

  cerrarSesion(): void {
    Swal.fire({
      title: "Seguro que quieres cerrar sesion?",
      icon: "warning",
      iconColor: "#8ea7f7",
      showCancelButton: true,
      confirmButtonColor: "#252525",
      cancelButtonColor: "#8ea7f7",
      confirmButtonText: "Si",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }

  checkSpecificUrl(): boolean {
    return this.router.url === '/';
  }

  checkUrl(ruta:string): boolean {
    return this.router.url === ruta;
  }

  scrollToSection(sectionId: string): void {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const offset = targetElement.offsetTop - this.el.nativeElement.querySelector('.navbar').offsetHeight;
      this.renderer.setProperty(document.documentElement, 'scrollTop', offset);
    }
  }

}
