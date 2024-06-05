// src/app/components/exito/exito.component.ts
import { Component, OnInit } from '@angular/core';
import { OrdenCompra, ProductoOrden } from './../../interfaces/pedido';
import { pedidoService } from '../../services/pedido.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CompressImageService } from '../../services/compressimage.service';
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
    private carritoService: CarritoService,
    private compressImageService: CompressImageService // Inyecta tu servicio
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

  async ngOnInit(): Promise<void> {
    const usuarioId = this.obtenerUsuarioId();
    const email = this.obtenerUsuarioEmail();
    let productos = JSON.parse(localStorage.getItem('compra') || '[]');
    let productosCompra = JSON.parse(localStorage.getItem('compra') || '[]');

    if (!Array.isArray(productos)) {
      productos = [productos];
    }
    if (!Array.isArray(productosCompra)) {
      productosCompra = [productosCompra];
    }

    const mapProducto = async (producto: any): Promise<ProductoOrden> => {
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
        const image = new Image();
        image.src = producto.dataUrl;
        await new Promise<void>((resolve, reject) => {
          image.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(image, 0, 0);
              producto.dataUrl = await this.compressImageService.compressImage(canvas, 0.8);
              resolve();
            } else {
              reject(new Error('Unable to get canvas context'));
            }
          };
        });
      }

      return productoOrden;
    };

    Promise.all(productos.map(mapProducto)).then((productosOrdenados) => {
      let orden: OrdenCompra = {
        _id: '',
        usuario_id: usuarioId,
        productos: productosOrdenados,
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

          this.enviarCorreoConfirmacion(orden, email);
        },
        error => {
          console.error('Error al enviar la orden', error);
        }
      );
    });
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
