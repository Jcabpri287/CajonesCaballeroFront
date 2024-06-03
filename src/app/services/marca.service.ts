import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Marca } from '../interfaces/marca';

@Injectable({
  providedIn: 'root'
})

export class marcaService {
  private url="https://cajonescaballeroback.onrender.com";
  private http = inject(HttpClient);

  getMarcas():Observable<Marca[]>{
    return this.http.get<Marca[]>(`${this.url}/marcas`).pipe(
      catchError(error=>{
        console.log(`Error al obtener las marcas ${error}`);
        return of ([])
      })
    );
  }

  getMarca(id:string):Observable<Marca>{
    return this.http.get<Marca>(`${this.url}/marcas/${id}`).pipe(
      map(res=>{
        return res as Marca;
      }),
      catchError(error=>{
        console.log(`Error al obtener la marca ${error}`);
        return of ({} as Marca)
      })
    );
  }

  addMarca(marca:Marca):Observable<boolean>{
    return this.http.post<Marca>(`${this.url}/marcas`,marca).pipe(
      map(res=>{
        return true;
     }),
      catchError(error=>{
        console.log(`Error al insertar la tarea ${error}`);
        return of (false)
      })
    );
  }

  updateMarca(marca:Marca,id:string):Observable<boolean>{
    return this.http.put<Marca>(`${this.url}/marcas/${id}`,marca).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al actualizar la marca ${error}`);
        return of (false)
      })
    );
  }

  delMarca(_id:string | undefined):Observable<boolean>{
    return this.http.delete(`${this.url}/marcas/${_id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al eliminar la marca ${error}`);
       return of (false);
     })
    );
   }
}
