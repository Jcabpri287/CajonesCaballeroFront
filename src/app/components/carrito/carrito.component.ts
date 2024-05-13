import { Component, NgModule } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { DatePipe } from '@angular/common';
import { Producto } from '../../interfaces/producto';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [HeaderComponent, DatePipe, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  constructor(private router: Router) {}

  verProducto(producto: Producto){
    this.router.navigate(['producto'], { state: { producto } });
  }

  agregarProducto(item: any, producto:any) {
    item.cantidad += 1;
    this.agregarAlCarrito(producto , "sumar");
  }

  eliminarProducto(item: any, producto:any) {
    if (item.cantidad > 0) {
      item.cantidad -= 1;
    }
    this.agregarAlCarrito(producto , "restar");
  }

  agregarAlCarrito(producto: any, accion: string): void {
    let carritoStr = sessionStorage.getItem('carrito');
    if (carritoStr !== null) {
      let carrito = JSON.parse(carritoStr);

      let index = carrito.findIndex((item: any) => item.producto._id === producto._id);

      if (index !== -1 && accion === "sumar") {
        carrito[index].cantidad++;
      } else if (index !== -1 && accion === "restar") {
        carrito[index].cantidad--;
        if (carrito[index].cantidad === 0) {
          carrito.splice(index, 1);
          this.productosEnCarrito.splice(index, 1);
        }
      } else {
        carrito.push({ producto: producto, cantidad: 1 });
      }

      sessionStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
      let carrito = [{ producto: producto, cantidad: 1 }];
      sessionStorage.setItem('carrito', JSON.stringify(carrito));
    }
  }

  comprarAhora(): void {
    this.productosEnCarrito.forEach(item => {
      if (item.seleccionado) {
        console.log("Comprar producto: ", item.producto.nombre);
      }
    });
    
  }

  obtenerProductosEnCarrito(): any[] {
    const carritoStr = sessionStorage.getItem('carrito');
    if (carritoStr !== null) {
      const carrito = JSON.parse(carritoStr);
      return carrito;
    } else {
      return [];
    }
  }

  productosEnCarrito: any[] = [];

  ngOnInit(): void {
    this.productosEnCarrito = this.obtenerProductosEnCarrito();
  }
}
