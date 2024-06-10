import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { StripeService } from '../../services/stripe.service';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-final-cajon',
  standalone: true,
  imports: [TranslateModule, FooterComponent],
  templateUrl: './final-cajon.component.html',
  styleUrl: './final-cajon.component.css'
})
export class FinalCajonComponent implements OnInit {
  tipoMadera? : string;
  tipoCuerdas? : string;
  dataUrl? : string;
  private isMouseDown: boolean = false;
  private mouseX: number = 0;

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private cube?: THREE.Mesh;
  private materials?: THREE.MeshBasicMaterial[];

  constructor(private router: Router , private stripeService: StripeService) {}
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef<HTMLDivElement>;

  ngOnInit(){
    if (typeof history !== 'undefined') {
      const navigationState = history.state;

      if (navigationState && navigationState.producto) {
        this.tipoMadera = navigationState.producto.tipoMadera;
        this.tipoCuerdas = navigationState.producto.tipoCuerdas;
        this.dataUrl = navigationState.producto.dataUrl;
      }else{
        this.router.navigate(["/personalizar"]);
      }
  }
  this.initThree();
  }

  private initThree(): void {
    if (typeof window !== 'undefined') {
      const scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, this.rendererContainer.nativeElement.offsetWidth / this.rendererContainer.nativeElement.offsetHeight, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(this.rendererContainer.nativeElement.offsetWidth, this.rendererContainer.nativeElement.offsetHeight);
      if (this.rendererContainer) {
        this.rendererContainer.nativeElement.appendChild(renderer.domElement);
      }

      if (this.tipoMadera) {
        const textures = this.obtenerTexturaMadera(this.tipoMadera);
        this.materials = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
        if (this.dataUrl) {
          const textureFront = new THREE.TextureLoader().load(this.dataUrl);
          this.materials[1] = new THREE.MeshBasicMaterial({ map: textureFront });
        }
      }

      const geometry = new THREE.BoxGeometry(1.8, 2.5, 1.5); // Ajusta el tamaño del cubo
      const cube = new THREE.Mesh(geometry, this.materials);
      this.cube = cube;
      scene.add(cube);

      this.camera.position.z = 2.8; // Ajusta la posición de la cámara para que el cubo sea visible

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
        if (this.camera) {
          renderer.render(scene, this.camera);
        }
      };

      animate();
    }
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

  irAVer(){
    const producto = {
      tipoMadera: this.tipoMadera,
      tipoCuerdas: this.tipoCuerdas,
      dataUrl : this.dataUrl
    };
    this.router.navigate(['/personalizar/pintar'], { state: { producto } });
  }

  zoomIn(): void {
    if (this.camera && this.camera.position.z > 1) {
      this.camera.position.z -= 0.1;
    }
  }

  zoomOut(): void {
    if (this.camera && this.camera.position.z < 3) {
      this.camera.position.z += 0.1;
    }
  }

  goUp(): void {
    if (this.camera && this.camera.position.y > -3) {
      this.camera.position.y -= 0.1;
    }
  }

  goDown(): void {
    if (this.camera && this.camera.position.y < 3) {
      this.camera.position.y += 0.1;
    }
  }

  descargar(){
    if (this.dataUrl) {
      const dataURL = this.dataUrl;

      const enlaceDescarga = document.createElement('a');
      enlaceDescarga.download = 'diseñoPersonalizado.png';
      enlaceDescarga.href = dataURL;
      enlaceDescarga.click();
    }
  }

  comprar():void {
    let producto = {
      nombre: "Cajon personalizado",
      descripcion: "Venta de cajon personalizado",
      precio:249.99,
      tipoCuerdas : this.tipoCuerdas,
      tipoMadera : this.tipoMadera,
      cantidad: 1,
      dataUrl: this.dataUrl
    }

    localStorage.setItem('compra', JSON.stringify(producto));

    this.stripeService.procesarPago({
      nombre: "Cajon personalizado",
      descripcion: "Venta de cajon personalizado",
      precio: 249.99
    });
  }
}
