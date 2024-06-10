import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import * as THREE from 'three';
import { NgIf } from '@angular/common';
import { productoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
import { Router, RouterLink } from '@angular/router';
import { TranslateCompiler, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../services/spinner-service.service';
import { FooterComponent } from '../footer/footer.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports : [HeaderComponent, NgIf , TranslateModule, RouterLink, FooterComponent],
  standalone:true
})

export class HomeComponent implements OnInit{
  showTerms: boolean = false;
  private isMouseDown: boolean = false;
  private mouseX: number = 0;
  cuatroProductos?: Producto[];
  messageRegister = "";
  messageLogin = "";

  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef<HTMLDivElement>;

  constructor(private translate: TranslateService,    private spinnerService: SpinnerService, private ngZone: NgZone, private renderer: Renderer2, private el: ElementRef, private productoService : productoService, private router: Router) {}

  toggleTerms(): void {
    this.showTerms = !this.showTerms;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initThree();
    });
    this.spinnerService.show();
    this.productoService.getCuatroProductos()
    .subscribe(productos => {
      this.cuatroProductos = productos;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });

    const showToast1 = localStorage.getItem('showToastRegister');
    const showToast2 = localStorage.getItem('showToastLogin');

    if (this.translate.currentLang === 'es') {
      this.messageRegister = "Usuario registrado correctamente";
    } else if (this.translate.currentLang === 'en') {
      this.messageRegister = "User registered successfully";
    }else{
      this.messageRegister = "Utente registrato con successo";
    }

    if (this.translate.currentLang === 'es') {
      this.messageLogin = "Sesión iniciada correctamente";
    } else if (this.translate.currentLang === 'en') {
      this.messageLogin = "Session started successfully";
    }else{
      this.messageLogin = "Sessione avviata con successo";
    }

    if (showToast1 === 'true') {
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
      Toast.fire({
        icon: "success",
        iconColor: "#8ea7f7",
        title: this.messageRegister
      });

      localStorage.removeItem('showToastRegister');
    }else if (showToast2 === 'true') {
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
      Toast.fire({
        icon: "success",
        iconColor: "#8ea7f7",
        title: this.messageLogin
      });

      localStorage.removeItem('showToastLogin');
    }
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

  irProducto(producto: Producto){
    this.router.navigate(['producto'], { state: { producto } });
  }
}
