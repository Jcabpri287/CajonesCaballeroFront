import { Component, OnInit } from '@angular/core';
import { OrdenCompra, ProductoOrden } from './../../interfaces/pedido';
import { pedidoService } from '../../services/pedido.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-exito',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './exito.component.html',
  styleUrls: ['./exito.component.css']
})
export class ExitoComponent implements OnInit {
  constructor(
    private ordenCompraService: pedidoService,
    private carritoService: CarritoService
  ) {}

  obtenerUsuarioId(): string {
    return sessionStorage.getItem('userId') || '';
  }

  obtenerUsuarioEmail(): string {
    return sessionStorage.getItem('storedMail') || '';
  }

  borrarPedido(): void {
    localStorage.removeItem('compra');
  }

  ngOnInit(): void {
    const usuarioId = this.obtenerUsuarioId();
    const email = this.obtenerUsuarioEmail();
    let productos = JSON.parse(localStorage.getItem('compra') || '[]');
    let productosCompra = JSON.parse(localStorage.getItem('compra') || '[]');

    // Asegurarse de que productos y productosCompra sean arrays
    if (!Array.isArray(productos)) {
      productos = [productos];
    }
    if (!Array.isArray(productosCompra)) {
      productosCompra = [productosCompra];
    }

    let orden: OrdenCompra;

    const mapProducto = (producto: any) => {
      let productoOrden: ProductoOrden = {
        _id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio,
        total: producto.precio * producto.cantidad,
        estado: 'pendiente',
        imagen_url: producto.imagen_url || ""
      };

      if (producto.tipoMadera) {
        productoOrden.tipo_madera = producto.tipoMadera;
      }

      if (producto.tipoCuerdas) {
        productoOrden.numero_cuerdas = producto.tipoCuerdas;
      }

      if (producto.dataUrl) {
        productoOrden.dataUrl = producto.dataUrl;
      }

      return productoOrden;
    };

    orden = {
      _id: '',
      usuario_id: usuarioId,
      productos: productos.map(mapProducto),
      estado: 'pendiente'
    };

    this.ordenCompraService.enviarOrdenCompra(orden).subscribe(
      response => {
        const productosEnCarrito = this.carritoService.obtenerCarritoDesdeLocalStorage();

        for (const productoCompra of productosCompra) {
          for (let i = 0; i < productosEnCarrito.length; i++) {
            if (productoCompra.id === productosEnCarrito[i].producto._id) {
              productosEnCarrito.splice(i, 1);
              break;
            }
          }
        }

        this.carritoService.actualizarCarrito(productosEnCarrito);
        this.borrarPedido();

        // Enviar correo electrónico de confirmación
        this.enviarCorreoConfirmacion(orden, email);
      },
      error => {
        console.error('Error al enviar la orden', error);
      }
    );
  }


  enviarCorreoConfirmacion(orden: OrdenCompra, email: string): void {
    console.log("LLegada");
    this.ordenCompraService.confirmarPedido({ orden, email }).subscribe(
      response => {
        console.log('Correo de confirmación enviado');
      },
      error => {
        console.error('Error al enviar el correo de confirmación', error);
      }
    );
  }
}
