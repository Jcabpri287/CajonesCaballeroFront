import { Component, ElementRef, Renderer2 } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [TranslateModule, FooterComponent],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) {

  }
  scrollToSection(sectionId: string): void {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const offset = targetElement.offsetTop;
      this.renderer.setProperty(document.documentElement, 'scrollTop', offset);
    }
  }
}
