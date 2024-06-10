import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CarritoService } from '../../services/carrito.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-cancelacion',
  standalone: true,
  imports: [TranslateModule, RouterLink, FooterComponent],
  templateUrl: './cancelacion.component.html',
  styleUrl: './cancelacion.component.css'
})
export class CancelacionComponent implements OnInit{
  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.borrarCompra();
  }
}
