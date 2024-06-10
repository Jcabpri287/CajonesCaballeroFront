import { NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { fabric } from 'fabric';
import * as THREE from 'three';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-pintar',
  standalone: true,
  imports: [NgStyle,FormsModule, NgIf, TranslateModule, FooterComponent],
  templateUrl: './pintar.component.html',
  styleUrl: './pintar.component.css'
})
export class PintarComponent implements OnInit{
  tipoMadera? : string;
  tipoCuerdas? : string;
  textoAInsertar: string = '';
  dibujoActivo: boolean = false;
  textoSeleccionado: fabric.IText | null = null;
  fuenteTexto: string = 'Arial';
  colorTexto: string = '#000000';
  colorLinea: string = '#000000';
  grosorPincel: number = 10;
  grosorTexto: number = 400;
  justificacionTexto: string = 'left';
  botonPresionado : boolean = false;

  private isMouseDown: boolean = false;
  private mouseX: number = 0;

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private cube?: THREE.Mesh;
  private materials?: THREE.MeshBasicMaterial[];

  @ViewChild('canvas', { static: true }) canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef<HTMLDivElement>;

  protected _canvas?: fabric.Canvas;

  constructor(private router: Router) {}


  ngOnInit() {
    if (this.canvasRef) {
      this._canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
        backgroundColor: 'white',
        width: window.innerWidth < 500 ? 250 : 350,
        height: 500,
        isDrawingMode: this.dibujoActivo
      });



      if (this._canvas.isDrawingMode) {
        this._canvas.freeDrawingBrush.width = this.grosorPincel;
        this._canvas.freeDrawingBrush.color = this.colorTexto;
      }

      this._canvas.on('selection:created', this.updateTextSelection.bind(this));
      this._canvas.on('selection:updated', this.updateTextSelection.bind(this));
      this._canvas.on('selection:cleared', () => this.textoSeleccionado = null);
      this._canvas.on('object:added', () => {
        const textureFront = this.actualizarTexturaCajon();
        if (this.materials) {
          this.materials[1].map = textureFront;
          this.materials[1].needsUpdate = true;
        }
      });
      this._canvas.on('object:modified', () => {
        const textureFront = this.actualizarTexturaCajon();
        if (this.materials) {
          this.materials[1].map = textureFront;
          this.materials[1].needsUpdate = true;
        }
      });

      this._canvas.on('mouse:down', (e: any) => {
        if (this._canvas && this._canvas.isDrawingMode) {
          this._canvas.freeDrawingBrush.width = this.grosorPincel;
        }
      });

      this._canvas.on('mouse:move', (e: any) => {
        if (this._canvas && this._canvas.isDrawingMode) {
          this._canvas.freeDrawingBrush.width = this.grosorPincel;
        }
      });

      this._canvas.on('object:selected', (e: any) => {
        let objetoSeleccionado = e.target;
        if (objetoSeleccionado !instanceof fabric.Textbox) {
          objetoSeleccionado.sendToBack();
          this._canvas?.requestRenderAll();
        }
      });
    }

    if (typeof history !== 'undefined') {
      const navigationState = history.state;

      if (navigationState && navigationState.producto) {
        this.tipoMadera = navigationState.producto.tipoMadera;
        this.tipoCuerdas = navigationState.producto.tipoCuerdas;
        if (navigationState.producto.dataUrl) {
          fabric.Image.fromURL(navigationState.producto.dataUrl, (img) => {
            this._canvas?.add(img);
          });
        }
      }else{
        this.router.navigate(["/personalizar"]);
      }
    }else{
      this.router.navigate(["/personalizar"]);
    }
    this.initThree();
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

        if (this.tipoMadera) {
          const textures = this.obtenerTexturaMadera(this.tipoMadera);
          this.materials = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));

          const textureFront = new THREE.TextureLoader().load('assets/img/design/blanco.png');
          this.materials[1] = new THREE.MeshBasicMaterial({ map: textureFront });
        }

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

    actualizarCajon(): void {
      const textureFront = this.actualizarTexturaCajon();
      if (this.materials) {
        this.materials[1].map = textureFront;
        this.materials[1].needsUpdate = true;
      }
    }

    actualizarTexturaCajon(): THREE.Texture {
      const dataUrl = this._canvas!.toDataURL();
      const texture = new THREE.TextureLoader().load(dataUrl);
      return texture;
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

    updateTextSelection(event: fabric.IEvent): void {
      if (event.target && event.target.type === 'textbox') {
        this.textoSeleccionado = event.target as fabric.IText;
        this.fuenteTexto = this.textoSeleccionado.fontFamily ?? 'Arial';
        this.colorTexto = this.textoSeleccionado.fill as string;
      } else {
        this.textoSeleccionado = null;
      }
    }

    agregarTexto(): void {
      if (this.textoAInsertar && this._canvas) {
        const text = new fabric.Textbox(this.textoAInsertar, {
          left: 100,
          top: 100,
          width: 150,
          fontSize: 20,
          fontFamily: this.fuenteTexto,
          fill: this.colorTexto
        });
        this._canvas.add(text);
        this._canvas.setActiveObject(text); // Añade esta línea
        this.textoAInsertar = '';
      }
    }

    cambiarFuente(): void {
      const objetoSeleccionado = this._canvas!.getActiveObject();
      if (objetoSeleccionado instanceof fabric.Textbox) {
        objetoSeleccionado.fontFamily = this.fuenteTexto;
        this._canvas?.requestRenderAll(); // Añade esta línea
      }
    }

    cambiarColor(): void {
      const objetoSeleccionado = this._canvas!.getActiveObject();
      if (objetoSeleccionado instanceof fabric.Textbox) {
        objetoSeleccionado.set({ fill: this.colorTexto });
        this._canvas?.requestRenderAll();
        this._canvas?.discardActiveObject().renderAll();

      }
    }

    cambiarGrosor(): void {
      const objetoSeleccionado = this._canvas!.getActiveObject();
      if (objetoSeleccionado instanceof fabric.Textbox) {
        objetoSeleccionado.set({ fontWeight: this.grosorTexto.toString() });
        this._canvas?.requestRenderAll();
      }
    }

    cambiarGrosorPintura(): void {
      const objetoSeleccionado = this._canvas!.getActiveObject();
      if (objetoSeleccionado instanceof fabric.Textbox) {
        objetoSeleccionado.set({ strokeWidth: this.grosorPincel });
        this._canvas?.requestRenderAll();
      }
    }

    cambiarColorPintura(): void {
      if (this._canvas) {
        const objetoSeleccionado = this._canvas.getActiveObject();
      if (objetoSeleccionado) {
        objetoSeleccionado.set({ fill: this.colorLinea });
        this._canvas.requestRenderAll();
      }
      this._canvas.freeDrawingBrush.color = this.colorLinea;
      this._canvas.discardActiveObject().renderAll();
      }
    }

    cambiarJustificacion(): void {
      const objetoSeleccionado = this._canvas!.getActiveObject();
      if (objetoSeleccionado instanceof fabric.Textbox) {
        objetoSeleccionado.set({ textAlign: this.justificacionTexto });
        this._canvas?.requestRenderAll();
      }
    }

    onFileInputChange(event: Event): void {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target!.result as string;
          img.onload = () => {
            const fabricImg = new fabric.Image(img);
            fabricImg.scaleToWidth(200);
            fabricImg.scaleToHeight(200 * (img.height / img.width));
            this._canvas!.add(fabricImg);
          };
        };
        reader.readAsDataURL(file);
      }
    }

    borrarImagenSeleccionada(): void {
        if (this._canvas) {
            let objetoSeleccionado = this._canvas.getActiveObject();
            if (objetoSeleccionado) {
              if (objetoSeleccionado instanceof fabric.ActiveSelection) {
                // Si es una selección activa, eliminar todos los objetos en la selección
                objetoSeleccionado.getObjects().forEach((objeto) => {
                  if (this._canvas) {
                    this._canvas.remove(objeto);
                  }
                });
              } else {
                // Si es un único objeto, eliminarlo
                this._canvas.remove(objetoSeleccionado);
              }
              this._canvas.discardActiveObject().renderAll();
            }
            const textureFront = this.actualizarTexturaCajon();
            if (this.materials) {
              this.materials[1].map = textureFront;
              this.materials[1].needsUpdate = true;
            }
        }
    }

    activarPintura(): void {
      if (this._canvas) {
      this.dibujoActivo = !this.dibujoActivo;
      this._canvas.isDrawingMode = this.dibujoActivo;
      }
    }

    // Método para cambiar el grosor del pincel
    cambiarGrosorPintar(grosor: number): void {
  if (this._canvas) {
  this._canvas.freeDrawingBrush.width = grosor;
}
    }

    // Método para dibujar un círculo
    dibujarCirculo(x: number, y: number, radio: number): void {
  const circulo = new fabric.Circle({
    left: x,
    top: y,
    radius: radio,
    fill: this.colorLinea,
    selectable: true
  });
  if (this._canvas) {
    this._canvas.add(circulo);
  }
    }

    // Método para dibujar un rectángulo
    dibujarRectangulo(x: number, y: number, ancho: number, alto: number): void {
  const rectangulo = new fabric.Rect({
    left: x,
    top: y,
    width: ancho,
    height: alto,
    fill: this.colorLinea,
    selectable: true
  });
  if (this._canvas) {

  this._canvas.add(rectangulo);
}
    }

    // Método para dibujar un triángulo
    dibujarTriangulo(x: number, y: number, ancho: number, alto: number): void {
  const triangulo = new fabric.Triangle({
    left: x,
    top: y,
    width: ancho,
    height: alto,
    fill: this.colorLinea,
    selectable: true
  });
  if (this._canvas) {
    this._canvas.add(triangulo);
  }
    }

    irAEleccion(){
      const producto = {
        tipoMadera: this.tipoMadera,
        tipoCuerdas: this.tipoCuerdas,
        dataUrl : this._canvas!.toDataURL()
      };

      this.router.navigate(['/personalizar'], { state: { producto } });
    }

    irAVer(){
      const producto = {
        tipoMadera: this.tipoMadera,
        tipoCuerdas: this.tipoCuerdas,
        dataUrl : this._canvas!.toDataURL()
      };
      this.router.navigate(['/personalizar/finalizar'], { state: { producto } });
    }

    getTipoMaderaBackground(): string {
      switch (this.tipoMadera) {
        case 'abedul':
          return 'assets/img/personalizacion/tiposMadera/Abedul.jpg';
        case 'caoba':
          return 'assets/img/personalizacion/tiposMadera/Caoba.jpg';
        case 'fenoquilo':
          return 'assets/img/personalizacion/tiposMadera/Fenoquilo.jpg';
        case 'haya':
          return 'assets/img/personalizacion/tiposMadera/Haya.jpg';
        case 'okume':
          return 'assets/img/personalizacion/tiposMadera/Okume.jpg';
        case 'sapelly':
          return 'assets/img/personalizacion/tiposMadera/Sapelly.jpg';
        case 'tilo':
          return 'assets/img/personalizacion/tiposMadera/Tilo.jpg';
        case 'pino':
          return 'assets/img/personalizacion/tiposMadera/Pino.jpg';
        default:
          return 'assets/img/default.jpg';
      }
    }

    fondoNormal(): void {
      this.botonPresionado = !this.botonPresionado;
      if (this._canvas && this.tipoMadera) {
        const backgroundUrl = this.getTipoMaderaBackground();
        fabric.Image.fromURL(backgroundUrl, (img) => {
          img.set({
            scaleX: this._canvas!.width! / img.width!,
            scaleY: this._canvas!.height! / img.height!
          });
          this._canvas?.setBackgroundImage(img, () => {
            this._canvas?.renderAll();
            const textureFront = this.actualizarTexturaCajon();
            if (this.materials) {
              this.materials[1].map = textureFront;
              this.materials[1].needsUpdate = true;
            }
          });
        });
      }
    }

    fondoBlanco(): void {
      this.botonPresionado = !this.botonPresionado;
      if (this._canvas) {
        const blankImage =
          'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        fabric.Image.fromURL(blankImage, (img) => {
          this._canvas?.setBackgroundImage(img, () => {
            if (this._canvas) {
              this._canvas!.setBackgroundColor('white', this._canvas.renderAll.bind(this._canvas));
            }
            const textureFront = this.actualizarTexturaCajon();
            if (this.materials) {
              this.materials[1].map = textureFront;
              this.materials[1].needsUpdate = true;
            }
          });
        });
      }
    }
  }
