import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})

export class productoService {
  private url="http://localhost:3000";
  private http = inject(HttpClient);

  getProductos():Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.url}/productos`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los productos ${error}`);
        return of ([])
      })
    );
  }

  getProducto(id:string):Observable<Producto>{
    return this.http.get<Producto>(`${this.url}/productos/${id}`).pipe(
      map(res=>{
        return res as Producto;
      }),
      catchError(error=>{
        console.log(`Error al obtener el producto ${error}`);
        return of ({} as Producto)
      })
    );
  }

  addProducto(productos:Producto):Observable<boolean>{
    return this.http.post<Producto>(`${this.url}/productos`,productos).pipe(
      map(res=>{
        return true;
     }),
      catchError(error=>{
        console.log(`Error al insertar el producto ${error}`);
        return of (false)
      })
    );
  }

  updateProducto(producto:Producto,id:string):Observable<boolean>{
    return this.http.put<Producto>(`${this.url}/productos/${id}`,producto).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al actualizar el producto ${error}`);
        return of (false)
      })
    );
  }

  delProducto(_id:string | undefined):Observable<boolean>{
    return this.http.delete(`${this.url}/productos/${_id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al eliminar el producto ${error}`);
       return of (false);
     })
    );
   }
}
