import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Comportamiento instantáneo
    });
  }
}
