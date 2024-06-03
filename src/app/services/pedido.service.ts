import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { OrdenCompra } from '../interfaces/pedido';

@Injectable({
  providedIn: 'root'
})

export class pedidoService {
  private url="http://localhost:3000";
  //inyectar HttpClient
  private http = inject(HttpClient);

  enviarOrdenCompra(orden: OrdenCompra): Observable<any> {
    return this.http.post<any>(`${this.url}/pedidos`, orden);
  }

  confirmarPedido(data: { orden: OrdenCompra, email: string }): Observable<any> {
    return this.http.post(`${this.url}/confirmar`, data);
  }

  //getTareas():Observable<Tarea[]>{
  //  return this.http.get<Tarea[]>(`${this.url}/tareas`).pipe(
  //    catchError(error=>{
  //      console.log(`Error al obtener los clientes ${error}`);
  //      return of ([])
  //    })
  //  );
  //}

  obtenerPedidosUsuario(usuarioId: string): Observable<OrdenCompra[]> {
    console.log(usuarioId);
    return this.http.get<OrdenCompra[]>(`${this.url}/pedidos/${usuarioId}`).pipe(
      catchError(error => {
        console.error('Error al obtener los pedidos del usuario:', error);
        return of([] as OrdenCompra[]); // Devuelve un arreglo vacío en caso de error
      })
    );
  }

  //addTarea(tarea:Tarea):Observable<boolean>{
  //  return this.http.post<Tarea>(`${this.url}/tarea`,tarea).pipe(
  //    map(res=>{
  //      return true;
  //   }),
  //    catchError(error=>{
  //      console.log(`Error al insertar la tarea ${error}`);
  //      return of (false)
  //    })
  //  );
  //}

  //updateTarea(tarea:Tarea,id:string):Observable<boolean>{
  //  console.log(tarea);
  //  return this.http.put<Tarea>(`${this.url}/tarea/${id}`,tarea).pipe(
  //    map(res=>{
  //      return true;
  //    }),
  //    catchError(error=>{
  //      console.log(`Error al actualizar el cliente ${error}`);
  //      return of (false)
  //    })
  //  );
  //}

  //delTarea(_id:string | undefined):Observable<boolean>{
  //  console.log(_id);
  //  return this.http.delete(`${this.url}/tarea/${_id}`).pipe(
  //    map(()=>true),
  //    catchError(error=>{
  //      console.log(`Error al eliminar la tarea ${error}`);
  //     return of (false);
  //   })
  //  );
  // }
}
