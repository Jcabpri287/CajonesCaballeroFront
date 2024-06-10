import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, TranslateModule, RouterLink, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  tooltipText: string = '';
  totalProductos: number = 0;
  showOptions: boolean = false;
  administrador: boolean = false;

  sesionIniciada(): boolean {
    return this.authService.isAuthenticated();
  }

  cerrarSesion(): void {
    Swal.fire({
      title: this.translate.instant('logout.confirm_title'),
      icon: "warning",
      iconColor: "#8ea7f7",
      showCancelButton: true,
      confirmButtonColor: "#252525",
      cancelButtonColor: "#8ea7f7",
      confirmButtonText: this.translate.instant('logout.yes'),
      cancelButtonText: this.translate.instant('logout.no')
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/']).then(() => {
          this.ngZone.onStable.asObservable().pipe(first()).subscribe(() => {
            this.cd.detectChanges();
            window.scrollTo(0, 0);
            window.location.reload(); 
          });
        });
      }
    });
  }

  checkSpecificUrl(): boolean {
    return this.router.url === '/';
  }

  checkUrl(ruta: string): boolean {
    return this.router.url === ruta;
  }

  scrollToSection(sectionId: string): void {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const offset = targetElement.offsetTop - this.el.nativeElement.querySelector('.navbar').offsetHeight;
      this.renderer.setProperty(document.documentElement, 'scrollTop', offset);
    }
  }

  constructor(private carritoService: CarritoService, private translate: TranslateService, private router: Router, private renderer: Renderer2, private el: ElementRef, private authService: LoginService, private cd: ChangeDetectorRef,
    private ngZone: NgZone) {
    this.translate.addLangs(['en', 'es', 'it']);
    const savedLang = localStorage.getItem('appLang') || 'en';
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
    this.setTooltipText(savedLang);
    if (sessionStorage.getItem('adminCookie') && sessionStorage.getItem('adminCookie') == "true") {
      this.administrador = true;
    }
  }

  ngOnInit(): void {
    this.carritoService.obtenerCarrito().subscribe(carrito => {
      this.totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    });
  }

  cambiarIdioma(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newLang = target.value;
    this.translate.use(newLang);
    this.setTooltipText(newLang);
    localStorage.setItem('appLang', newLang);
  }

  setTooltipText(lang: string) {
    let tooltipKey = '';
    switch (lang) {
      case 'en':
        tooltipKey = 'CHANGE_LANGUAGE_TOOLTIP_ES';
        break;
      case 'es':
        tooltipKey = 'CHANGE_LANGUAGE_TOOLTIP_EN';
        break;
      case 'it':
        tooltipKey = 'CHANGE_LANGUAGE_TOOLTIP_IT';
        break;
      default:
        tooltipKey = 'CHANGE_LANGUAGE_TOOLTIP_EN';
    }
    this.translate.get(tooltipKey).subscribe((res: string) => {
      this.tooltipText = res;
    });
  }
}
