import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { SpinnerService } from '../../services/spinner-service.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-personalizar',
  standalone: true,
  imports: [HeaderComponent, NgFor, FormsModule, NgClass, TranslateModule, FooterComponent],
  templateUrl: './personalizar.component.html',
  styleUrl: './personalizar.component.css'
})
export class PersonalizarComponent implements OnInit, AfterViewInit{
  tipoMadera: string = 'okume'; // Madera por defecto
  tipoCuerdas: string = 'sin-cuerdas'; // Sin cuerdas por defecto
  dataUrl?: Object;

  private isMouseDown: boolean = false;
  private mouseX: number = 0;

  tiposMadera = [
    { value: 'okume', imagen: 'assets/img/personalizacion/tiposMadera/Okume.jpg', label: 'Okume' },
    { value: 'caoba', imagen: 'assets/img/personalizacion/tiposMadera/Caoba.jpg', label: 'Caoba' },
    { value: 'abedul', imagen: 'assets/img/personalizacion/tiposMadera/Abedul.jpg', label: 'Abedul' },
    { value: 'fenoquilo', imagen: 'assets/img/personalizacion/tiposMadera/Fenoquilo.jpg', label: 'Fenoquilo' },
    { value: 'haya', imagen: 'assets/img/personalizacion/tiposMadera/Haya.jpg', label: 'Haya' },
    { value: 'sapelly', imagen: 'assets/img/personalizacion/tiposMadera/Sapelly.jpg', label: 'Sapelly' },
    { value: 'tilo', imagen: 'assets/img/personalizacion/tiposMadera/Tilo.jpg', label: 'Tilo' },
    { value: 'pino', imagen: 'assets/img/personalizacion/tiposMadera/Pino.jpg', label: 'Pino' },
  ];


  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef<HTMLDivElement>;

  constructor(private ngZone: NgZone,public spinnerService: SpinnerService, private el: ElementRef,  private router: Router, private translate: TranslateService) {}

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private cube?: THREE.Mesh;
  private materials?: THREE.MeshBasicMaterial[];

  ngOnInit() {
    if (window.innerWidth < 992) {
      this.mostrarAlerta();
    }
    if (typeof history !== 'undefined') {
      const navigationState = history.state;

      if (navigationState && navigationState.producto) {
        this.tipoMadera = navigationState.producto.tipoMadera;
        this.tipoCuerdas = navigationState.producto.tipoCuerdas;
        this.dataUrl = navigationState.producto.dataUrl;
      }
    }else{
      this.router.navigate(["/personalizar"]);
    }
  }

  ngAfterViewInit() {
    this.initThree();
  }

  mostrarAlerta() {
    Swal.fire({
      title: this.translate.instant('recomendacion.titulo'),
      text: this.translate.instant('recomendacion.mensaje'),
      icon: 'info',
      iconColor: "#8ea7f7",
      showCancelButton: true,
      confirmButtonText: this.translate.instant('recomendacion.confirmar'),
      confirmButtonColor: "#8ea7f7",
      cancelButtonColor: "#252525",
      cancelButtonText: this.translate.instant('recomendacion.cancelar')
    }).then((result) => {
      if (!result.isConfirmed) {
        this.router.navigate(['/'])
      }
    });
  }

  private initThree(): void {
    if (typeof window !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, this.rendererContainer.nativeElement.offsetWidth / this.rendererContainer.nativeElement.offsetHeight, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(this.rendererContainer.nativeElement.offsetWidth, this.rendererContainer.nativeElement.offsetHeight);
      if (this.rendererContainer) {
        this.rendererContainer.nativeElement.appendChild(renderer.domElement);
      }

      const textures = this.obtenerTexturaMadera(this.tipoMadera);
      this.materials = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));

      const geometry = new THREE.BoxGeometry(1.8, 2.5, 1.5); // Ajusta el tamaño del cubo
      const cube = new THREE.Mesh(geometry, this.materials);
      this.cube = cube;
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

  actualizarCajon(madera: string) {
    this.tipoMadera = madera;
    const textures = this.obtenerTexturaMadera(madera);

    // Asigna la textura específica para la cara frontal

    // Actualiza todas las texturas, incluida la textura específica para la cara frontal
    this.materials?.forEach((material, index) => {
            material.map = textures[index];
        material.needsUpdate = true;
    });

    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 500);
  }

  obtenerTexturaMadera(tipoMadera: string): THREE.Texture[] {
    const texturasMadera: { [key: string]: string } = {
      abedul: 'assets/img/personalizacion/tiposMadera/Abedul.jpg',
      caoba: 'assets/img/personalizacion/tiposMadera/Caoba.jpg',
      fenoquilo: 'assets/img/personalizacion/tiposMadera/Fenoquilo.jpg',
      haya: 'assets/img/personalizacion/tiposMadera/Haya.jpg',
      okume: 'assets/img/personalizacion/tiposMadera/Okume.jpg',
      sapelly: 'assets/img/personalizacion/tiposMadera/Sapelly.jpg',
      tilo: 'assets/img/personalizacion/tiposMadera/Tilo.jpg',
      pino: 'assets/img/personalizacion/tiposMadera/Pino.jpg',
    };

    const rutaTextura = texturasMadera[tipoMadera];
    const texture = new THREE.TextureLoader().load(rutaTextura);
    return [texture, texture, texture, texture, texture, texture];
  }

  irAPintar(){
  const producto = {
    tipoMadera: this.tipoMadera,
    tipoCuerdas: this.tipoCuerdas,
    dataUrl : this.dataUrl
  };

  this.router.navigate(['/personalizar/pintar'], { state: { producto } });
  }
}
