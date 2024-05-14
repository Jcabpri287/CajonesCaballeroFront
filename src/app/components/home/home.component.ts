import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, NgZone, Renderer2, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import * as THREE from 'three';
import { NgIf } from '@angular/common';
import { productoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports : [HeaderComponent, NgIf],
  standalone:true
})

export class HomeComponent {
  showTerms: boolean = false;
  private isMouseDown: boolean = false;
  private mouseX: number = 0;
  cuatroProductos?: Producto[];


  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef<HTMLDivElement>;

  constructor(private ngZone: NgZone, private renderer: Renderer2, private el: ElementRef, private productoService : productoService, private router: Router) {}

  toggleTerms(): void {
    this.showTerms = !this.showTerms;
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

  scrollToSection(sectionId: string): void {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const offset = targetElement.offsetTop - this.el.nativeElement.querySelector('.navbar').offsetHeight;
      this.renderer.setProperty(document.documentElement, 'scrollTop', offset);
    }
  }

  ngOnInit(): void {
    console.log("Component initialized");
    this.ngZone.runOutsideAngular(() => {
      this.initThree();
    });
    this.productoService.getCuatroProductos()
      .subscribe(productos => {
        this.cuatroProductos = productos;
      });
  }

  verProducto(producto: Producto){
    this.router.navigate(['producto'], { state: { producto } });
  }

  private initThree(): void {
    if (typeof window !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, this.rendererContainer.nativeElement.offsetWidth / this.rendererContainer.nativeElement.offsetHeight, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({ alpha: true }); // Habilita la transparencia del fondo
      renderer.setSize(this.rendererContainer.nativeElement.offsetWidth, this.rendererContainer.nativeElement.offsetHeight);
      if (this.rendererContainer) {
        this.rendererContainer.nativeElement.appendChild(renderer.domElement);
      }

      const textureLoader = new THREE.TextureLoader();
      const textures = [
        textureLoader.load('assets/img/design/tableroAgujero.jpg'),
        textureLoader.load('assets/img/design/tableroEnfrente.jpg'),
        textureLoader.load('assets/img/design/tableroLateral.jpg'),
        textureLoader.load('assets/img/design/tableroLateral.jpg'),
        textureLoader.load('assets/img/design/tableroLateral.jpg'),
        textureLoader.load('assets/img/design/tableroLateral.jpg')
      ];

      const materials = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));

      const geometry = new THREE.BoxGeometry(1.8, 2.5, 1.5); // Ajusta el tamaño del cubo
      const cube = new THREE.Mesh(geometry, materials);
      scene.add(cube);

      camera.position.z = 2.8; // Ajusta la posición de la cámara para que el cubo sea visible

      const onMouseDown = (event: MouseEvent) => {
        this.isMouseDown = true;
        this.mouseX = event.clientX;
      };

      const onMouseMove = (event: MouseEvent) => {
        if (this.isMouseDown) {
          const deltaX = event.clientX - this.mouseX;
          cube.rotation.y += deltaX * 0.01; // Ajusta la velocidad de rotación según el desplazamiento del mouse
          this.mouseX = event.clientX;
        }
      };

      const onMouseUp = () => {
        this.isMouseDown = false;
      };

      const onMouseLeave = () => {
        this.isMouseDown = false; // Establece isMouseDown a falso cuando el mouse sale del área de renderización
      };

      const onMouseEnter = () => {
        this.isMouseDown = false; // Establece isMouseDown a falso cuando el mouse entra en el área de renderización
      };

      const onMouseOut = () => {
        this.isMouseDown = false; // Establece isMouseDown a falso cuando el mouse entra en el área de renderización
      };

      // Agregar oyentes de eventos de mouse
      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('mouseup', onMouseUp);
      renderer.domElement.addEventListener('mouseleave', onMouseLeave); // Agrega el evento mouseleave
      renderer.domElement.addEventListener('mouseout', onMouseOut); // Agrega el evento mouseout
      renderer.domElement.addEventListener('mouseenter', onMouseEnter); // Agregar el oyente de evento mouseenter

      const animate = () => {
        requestAnimationFrame(animate);
        if (!this.isMouseDown) {
          cube.rotation.y += 0.002;
        }
        renderer.render(scene, camera);
      };

      animate();
    }
  }
}
