import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class usuarioService {
  private url="http://localhost:3000";
  constructor(private http: HttpClient) {}

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}/usuarios`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usuarios ${error}`);
        return of ([])
      })
    );
  }

  getUsuario(id:string):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.url}/usuarios/${id}`).pipe(
      map(res=>{
        return res as Usuario;
      }),
      catchError(error=>{
        console.log(`Error al obtener el usuario ${error}`);
        return of ({} as Usuario)
      })
    );
  }

  getUsuarioConGmail(gmail: string): Observable<boolean> {
    return this.http.get<any>(`${this.url}/usuario/${gmail}`).pipe(
      map(res => {
        return res.found || false;
      }),
      catchError(error => {
        console.log(`Error al obtener el usuario ${error}`);
        return of(false);
      })
    );
  }

  loginUsuario(correo: string, contraseña: string): Observable<Usuario> {
    const body = { correo: correo, contraseña: contraseña };
    return this.http.post<any>(`${this.url}/login`, body).pipe(
      map(res=>{
        return res as Usuario;
      }),
      catchError(error => {
        console.log(`Error en el inicio de sesión: ${error}`);
        throw error;
      })
    );
  }

  addUsuario(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(`${this.url}/usuarios`,usuario).pipe(
      map(res=>{
        return res as Usuario;
     }),
      catchError(error=>{
          throw error;
        })
    );
  }

  getCorreos():Observable<String[]>{
    return this.http.get<String[]>(`${this.url}/correos`).pipe(
      map(res=>{
        return res as String[];
      }),
      catchError(error=>{
        console.log(`Error al obtener el usuario ${error}`);
        return of ({} as String[])
      })
    );
  }

  updateUsuario(usuario:Usuario,id:string):Observable<boolean>{
    console.log(id);
    return this.http.put<Usuario>(`${this.url}/usuarios/${id}`,usuario).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al actualizar el usuario ${error}`);
        return of (false)
      })
    );
  }

  delUsuario(_id:string | undefined):Observable<boolean>{
    return this.http.delete(`${this.url}/usuarios/${_id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al eliminar el usuario ${error}`);
        return of (false);
      })
    );
  }
}
