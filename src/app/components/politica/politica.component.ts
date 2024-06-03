import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-politica',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './politica.component.html',
  styleUrl: './politica.component.css'
})
export class PoliticaComponent {

}
