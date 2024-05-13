import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-pagina404',
  standalone: true,
  imports: [RouterLink, HeaderComponent],
  templateUrl: './pagina404.component.html',
  styleUrl: './pagina404.component.css'
})
export class Pagina404Component {

}
