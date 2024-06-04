import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Comentario } from '../interfaces/comentario';

@Injectable({
  providedIn: 'root'
})

export class comentarioService {
  private url="http://localhost:3000";
  private http = inject(HttpClient);

  getComentarios():Observable<Comentario[]>{
    return this.http.get<Comentario[]>(`${this.url}/comentarios`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los comentarios ${error}`);
        return of ([])
      })
    );
  }

  getComentariosProducto(id : string | undefined):Observable<Comentario[]>{
    return this.http.get<Comentario[]>(`${this.url}/comentarios/${id}`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los comentarios ${error}`);
        return of ([])
      })
    );
  }

  addComentario(comentarios:Comentario):Observable<boolean>{
    return this.http.post<Comentario>(`${this.url}/comentarios`,comentarios).pipe(
      map(res=>{
        return true;
     }),
      catchError(error=>{
        console.log(`Error al insertar el comentario ${error}`);
        return of (false)
      })
    );
  }

  updateComentario(comentarios:Comentario,id:string):Observable<boolean>{
    return this.http.put<Comentario>(`${this.url}/comentarios/${id}`,comentarios).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al actualizar el comentario ${error}`);
        return of (false)
      })
    );
  }

  delComentario(_id:string | undefined):Observable<boolean>{
    return this.http.delete(`${this.url}/comentarios/${_id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al eliminar el comentario ${error}`);
       return of (false);
     })
    );
   }
}
