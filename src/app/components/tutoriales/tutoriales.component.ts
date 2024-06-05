import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, SwiperOptions } from 'swiper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-tutoriales',
  standalone: true,
  imports: [NgFor, SwiperModule, TranslateModule, NgIf],
  templateUrl: './tutoriales.component.html',
  styleUrl: './tutoriales.component.css'
})
export class TutorialesComponent implements OnInit{
  config: SwiperOptions = {
    loop: false,
    spaceBetween: 30,
    navigation: false,
    pagination: {
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 1
    },
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    breakpoints: {
      576: {
        slidesPerView: 1,
        spaceBetween: 10
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  };
  window: any;

  // Resto del código

  ngAfterViewInit(): void {
    this.updateSwiper();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateSwiper();
  }

  updateSwiper(): void {
    const swiperEl: any = document.querySelector('swiper');
    if (swiperEl && swiperEl.swiper) {
      swiperEl.swiper.update();
    }
  }


  tutorialesFaciles: any[] = [];
  tutorialesMedios: any[] = [];
  tutorialesAvanzados: any[] = [];
  tutorialesDivertidos: any[] = [];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadVideoTitles();
    this.translate.onLangChange.subscribe(() => {
      this.loadVideoTitles();
    });
    this.window = window;
  }

  loadVideoTitles(): void {
    this.tutorialesFaciles = this.getVideos('faciles');
    this.tutorialesMedios = this.getVideos('medios');
    this.tutorialesAvanzados = this.getVideos('avanzados');
    this.tutorialesDivertidos = this.getVideos('divertidos');
  }

  getVideos(level: string): any[] {
    const titles: string[] = this.translate.instant(`tutorials.videos.${level}`);
    const ids: { [key: string]: string[] } = {
      faciles: ['CQOOzKvP5kY', 'iEFvjDc3qWI', '3QoQDw8xADY', 'DTAPaGV4O-8', 'pa4K6WEwErc', '5dDIkeXZ7fM', 'tnaHuo14A6E', 'zOeomwLWLco', 'ek_FRDUjGyA', 'OpfRN7immrQ', '9MDHcxb0YlY', 'CyUClmZXcmE'],
      medios: ['7gQovs7bWm8', 'WjSu6lXhKgA', '1EA888dKb0Y', 'Pm2UIlrZGBs', '4w5OyXVOMfQ', 'pIw_eizSDLQ', '-whfiEC3JmQ', 'i42fQ1B5hO0', 'EB8Wizp04gk', 'TJXHy99vtDs', 'KrzpFSs1rbM'],
      avanzados: ['7vhuMllKyjg', '1Ye0QcFFJmY', 'sJ33cr6Yhtk', '2lNDlGYcIdY'],
      divertidos: ['6-sv6hKjtaU', 'PvMAIQPTXgE', 'ke4K4JLTEvk']
    };

    const videoIds = ids[level] ?? [];
    if (!Array.isArray(titles) || titles.length !== videoIds.length) {
      return [];
    }

    return titles.map((title, index) => ({
      id: videoIds[index],
      title: title,
      url: `https://www.youtube.com/watch?v=${videoIds[index]}`
    }));
  }

  getYoutubeThumbnail(id: string): string {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
}
