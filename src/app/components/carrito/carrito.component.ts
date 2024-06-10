import { Component, NgModule } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { DatePipe } from '@angular/common';
import { Producto } from '../../interfaces/producto';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StripeService } from '../../services/stripe.service';
import { TranslateModule } from '@ngx-translate/core';
import { CarritoService } from '../../services/carrito.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [HeaderComponent, DatePipe, FormsModule, TranslateModule, FooterComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  productosEnCarrito: any[] = [];

  constructor(private router: Router, private stripeService: StripeService, private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.obtenerCarrito().subscribe(carrito => {
      this.productosEnCarrito = carrito;
    });
  }

  verProducto(producto: Producto){
    this.router.navigate(['producto'], { state: { producto } });
  }

  agregarProducto(item: any) {
    this.carritoService.agregarProducto(item.producto);
  }

  eliminarProducto(item: any) {
    this.carritoService.eliminarProducto(item.producto);
  }

  comprarAhora(): void {
    const productosSeleccionados = this.productosEnCarrito.filter(item => item.seleccionado);
    if (productosSeleccionados.length > 0) {
      let productosAProcesar : any[] = [];
      let precioTotal = 0;
      productosSeleccionados.forEach(producto => {
        precioTotal += (producto.producto.precio * producto.cantidad);
        productosAProcesar.push({
            nombre: producto.producto.nombre,
            descripcion: producto.producto.descripcion,
            precio: producto.producto.precio,
            cantidad: producto.cantidad,
            id : producto.producto._id,
            imagen_url: producto.producto.imagen_url
        });
      });

      localStorage.setItem('compra', JSON.stringify(productosAProcesar));

      if (productosSeleccionados.length > 1) {
        this.stripeService.procesarPago({
          nombre: "Encargo de varios cajones",
          descripcion: "Venta de multiples cajones flamencos",
          precio: precioTotal
        });
      } else {
        this.stripeService.procesarPago({
          nombre: productosAProcesar[0].nombre,
          descripcion: productosAProcesar[0].descripcion,
          precio: precioTotal
        });
      }
    }
  }
}
