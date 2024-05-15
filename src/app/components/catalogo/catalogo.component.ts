import { Component, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Producto } from '../../interfaces/producto';
import { productoService } from '../../services/producto.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { PriceFilterPipe } from '../../pipes/price-filter.pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [HeaderComponent, NgFor, PaginationModule, DatePipe, ReactiveFormsModule, FormsModule, PriceFilterPipe, NgIf],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit{
  minPrice: number = 0;
  maxPrice: number = 50;
  ordenFecha: string = 'recientes';
  productos: Producto[] = [];
  productosIniciales: Producto[] = [];
  page: number = 1;
  itemsPerPage: number = 15;
  constructor(private productoService: productoService,private cdRef: ChangeDetectorRef, private router: Router) {}
  totalItems: number = 0;
  selectedCategory: string = 'todas';
  filtroNombre: string = '';

  getProductosPaginados(): Producto[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.productos.slice(startIndex, endIndex);
  }

  ngOnInit() {
    this.obtenerProductos();
    this.aplicarFiltro();
  }

  obtenerProductos() {
    this.productoService.getProductos()
      .subscribe(productos => {
        this.productos = productos;
        this.productosIniciales = productos;
        this.totalItems = productos.length;
      });
  }

  aplicarFiltro() {
    let productosFiltrados =  this.productosIniciales.filter(producto =>
      producto.precio >= this.minPrice && producto.precio <= this.maxPrice
    );

    productosFiltrados = productosFiltrados.filter(producto =>
      producto.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );

    productosFiltrados = productosFiltrados.filter(producto =>
        (this.selectedCategory === 'todas' || producto.categoria === this.selectedCategory) && // Filtra por categoría
        producto.precio >= this.minPrice && producto.precio <= this.maxPrice &&
        (!document.getElementById('stock') || (document.getElementById('stock') as HTMLInputElement).checked ? producto.stock > 0 : true)
    );


    if (this.ordenFecha === 'recientes') {
      productosFiltrados.sort((a, b) => new Date(b.fecha_lanzamiento).getTime() - new Date(a.fecha_lanzamiento).getTime());
    } else if (this.ordenFecha === 'antiguos') {
      productosFiltrados.sort((a, b) => new Date(a.fecha_lanzamiento).getTime() - new Date(b.fecha_lanzamiento).getTime());
    }

    this.totalItems = productosFiltrados.length;
    this.productos = productosFiltrados;
    this.page = 1;
    this.cdRef.detectChanges();
  }

  verProducto(producto: Producto){
    this.router.navigate(['producto'], { state: { producto } });
  }

  agregarAlCarrito(producto: any): void {
    let carritoStr = sessionStorage.getItem('carrito');
    if (carritoStr !== null) {
      let carrito = JSON.parse(carritoStr);

      let index = carrito.findIndex((item: any) => item.producto._id === producto._id);

      if (index !== -1) {
        carrito[index].cantidad++;
      } else {
        carrito.push({ producto: producto, cantidad: 1 });
      }

      sessionStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
      let carrito = [{ producto: producto, cantidad: 1 }];
      sessionStorage.setItem('carrito', JSON.stringify(carrito));
    }
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    const messageWithLink = `<p style='margin-bottom:3px;'>Producto añadido al carrito satisfactoriamente.</p> <a href="/carrito">Ver carrito</a>`;

    Toast.fire({
      icon: "success",
      iconColor: "#8ea7f7",
      html: messageWithLink
    });
}
}
