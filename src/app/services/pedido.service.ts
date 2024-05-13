import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class pedidoService {
  private url="http://localhost:3000";
  //inyectar HttpClient
  private http = inject(HttpClient);

  //getTareas():Observable<Tarea[]>{
  //  return this.http.get<Tarea[]>(`${this.url}/tareas`).pipe(
  //    catchError(error=>{
  //      console.log(`Error al obtener los clientes ${error}`);
  //      return of ([])
  //    })
  //  );
  //}

  //getTarea(id:string):Observable<Tarea>{
  //  return this.http.get<Tarea>(`${this.url}/tarea/${id}`).pipe(
  //    map(res=>{
  //      return res as Tarea;
  //    }),
  //    catchError(error=>{
  //      console.log(`Error al obtener la tarea ${error}`);
  //      return of ({} as Tarea)
  //    })
  //  );
  //}

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
