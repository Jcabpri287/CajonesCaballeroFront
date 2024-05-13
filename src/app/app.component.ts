import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SpinnerService } from './services/spinner-service.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FooterComponent, SpinnerComponent,CommonModule,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TFGPage';
  constructor(public spinnerService: SpinnerService,private router: Router) { }
  mostrarHeader?: boolean;

  ngOnInit() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);
  }

  isHomePage(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/';
  }

}
