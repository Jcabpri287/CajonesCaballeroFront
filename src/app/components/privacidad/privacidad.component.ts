import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [TranslateModule, RouterLink, FooterComponent],
  templateUrl: './privacidad.component.html',
  styleUrl: './privacidad.component.css'
})
export class PrivacidadComponent {

}
