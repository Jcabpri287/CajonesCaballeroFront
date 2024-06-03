import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { pedidoService } from '../../services/pedido.service';
import { Producto } from '../../interfaces/producto';
import { Router } from '@angular/router';
import { SumPrecioPipe } from '../../pipes/sum-precio.pipe';
import { CuerdasPipe } from '../../pipes/cuerdas.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerService } from '../../services/spinner-service.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [HeaderComponent, NgFor, NgIf, SumPrecioPipe, NgClass,CuerdasPipe, TranslateModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {
  pedidos: any[] = []; // Arreglo para almacenar los pedidos del usuario
  precioTotal = 0;
  constructor(private pedidoService: pedidoService, private router : Router, private spinner : SpinnerService) { }

  ngOnInit(): void {
    // Llama a una función en tu servicio que obtenga los pedidos del usuario actual
    this.obtenerPedidosUsuario();
  }

  obtenerPedidosUsuario(): void {
    this.spinner.show()
    let idUsuario = sessionStorage.getItem("userId");
    // Aquí llamas a tu servicio para obtener los pedidos del usuario actual
    // El método obtenerPedidosUsuario() debería devolver un arreglo de objetos que representen los pedidos del usuario
    this.pedidoService.obtenerPedidosUsuario(idUsuario || "").subscribe(
      (response: any) => {
        this.pedidos = response; // Asigna la respuesta del servicio a la propiedad pedidos
        this.spinner.hide()
      },
      (error: any) => {
        console.error('Error al obtener los pedidos:', error);
        this.spinner.hide()
      }
    );


  }

}
