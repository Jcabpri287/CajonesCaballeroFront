import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Producto } from '../../interfaces/producto';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { marcaService } from '../../services/marca.service';
import { Comentario } from '../../interfaces/comentario';
import { comentarioService } from '../../services/comentario.service';
import { usuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [HeaderComponent,DatePipe,FormsModule, DatePipe],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  producto?: Producto;
  nombreMarca?: string;
  comentarios?: Comentario[];
  nuevoComentario: string = '';

  constructor(private route: ActivatedRoute, private marcas : marcaService, private comentariosService : comentarioService, public loginService : LoginService) {}

  ngOnInit(): void {
    if (typeof history !== 'undefined') {
      const navigationState = history.state;

      if (navigationState && navigationState.producto) {
        this.producto = navigationState.producto;
      }

      if (this.producto?.marca_id) {
        this.marcas.getMarca(this.producto?.marca_id)
        .subscribe(nombre => {
          this.nombreMarca = nombre.nombre;
        });

        this.comentariosService.getComentariosProducto(this.producto?._id)
        .subscribe(comentarios => {
          this.comentarios = comentarios;
        });
      }
    }
  }

    agregarAlCarrito(producto: any): void {
      let carritoStr = sessionStorage.getItem('carrito');
      if (carritoStr !== null) {
        let carrito = JSON.parse(carritoStr);

        let index = carrito.findIndex((item: any) => item.producto.id === producto.id);

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

  enviarComentario(): void {
    if (this.nuevoComentario.trim() !== '') {
      if (this.loginService.isAuthenticated()) {
        this.comentarios?.unshift({ nombreUsuario: sessionStorage.getItem('username') || "", texto: this.nuevoComentario ,producto_id: "" , usuario_id: "", fecha : new Date ()})

      const nuevoComentario = {
        nombreUsuario: sessionStorage.getItem('username') || "",
        texto: this.nuevoComentario || "",
        producto_id: this.producto?._id || "",
        usuario_id: sessionStorage.getItem('userId') || ""
      }

      this.comentariosService.addComentario(nuevoComentario).subscribe(
        error => {
          console.log(error);
        }
      );
      this.nuevoComentario = '';
      }else{
        Swal.fire({
          icon: 'error',
          iconColor: "#8ea7f7",
          title: 'Error',
          confirmButtonColor: "#252525",
          text: 'Inicia sesion para enviar un comentario.'
        });
      }
    }
  }
}
