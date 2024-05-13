import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.css'],
  standalone:true
})
export class SwiperComponent implements AfterViewInit, OnDestroy {


  constructor(private elementRef: ElementRef,private swiper: Swiper) { }

  ngAfterViewInit(): void {
    this.swiper = new Swiper(this.elementRef.nativeElement.querySelector('.swiper-container'), {
      // Configuración del swiper
      loop: true,
      // Otras opciones de configuración según necesites
    });
  }

  ngOnDestroy(): void {
    // Destruir el swiper al salir del componente para evitar pérdidas de memoria
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}
