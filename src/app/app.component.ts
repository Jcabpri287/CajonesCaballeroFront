import { AfterViewInit, Component, Renderer2, NgZone, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SpinnerService } from './services/spinner-service.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CommonModule, NgIf } from '@angular/common';
import { ScrollService } from './services/scroll.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SpinnerComponent, CommonModule, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'TFGPage';

  constructor(
    private renderer: Renderer2,
    public spinnerService: SpinnerService,
    private router: Router,
    private scrollService: ScrollService,
    private viewportScroller: ViewportScroller,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  mostrarHeader?: boolean;

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const isHome = this.router.url === '/';
        this.ngZone.run(() => {
          if (isHome) {
            this.renderer.addClass(document.documentElement, 'smooth-scroll');
            setTimeout(() => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth' // Aseguramos el comportamiento suave para el home
              });
            }, 0);
          } else {
            this.renderer.removeClass(document.documentElement, 'smooth-scroll');
            // Forzamos un scroll instantáneo cuando no estamos en el home
            setTimeout(() => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'auto'
              });
            }, 0);
          }
          this.cdr.detectChanges(); // Forzar la detección de cambios
        });
      }
    });
  }

  isHomePage(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/';
  }
}
  