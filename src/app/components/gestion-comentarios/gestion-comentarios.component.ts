import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Comentario } from '../../interfaces/comentario';
import { comentarioService } from '../../services/comentario.service';
import { SpinnerService } from '../../services/spinner-service.service';
import { DatePipe } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-gestion-comentarios',
  standalone: true,
  imports: [TranslateModule, DatePipe, FooterComponent],
  templateUrl: './gestion-comentarios.component.html',
  styleUrl: './gestion-comentarios.component.css'
})
export class GestionComentariosComponent implements OnInit{
  comentarios?: Comentario [];

  constructor(private comentarioService : comentarioService, private spinner : SpinnerService){

  }

  ngOnInit(): void {
    this.spinner.show();
    this.comentarioService.getComentarios().subscribe(comentarios => {
      this.comentarios = comentarios;
      this.spinner.hide();
    });
  }

  borrarComentario(id: string | undefined) {
    this.spinner.show();
    if (!id) {
        this.spinner.hide();
        return;
    }

    this.comentarioService.delComentario(id).subscribe({
        next: () => {
            this.comentarioService.getComentarios().subscribe({
                next: comentarios => {
                    this.comentarios = comentarios;
                    this.spinner.hide();
                },
                error: err => {
                    this.spinner.hide();
                }
            });
        },
        error: err => {
            this.spinner.hide();
        }
    });
}

}
