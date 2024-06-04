import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { OrdenCompra } from '../interfaces/pedido';

@Injectable({
  providedIn: 'root'
})

export class pedidoService {
  private url="https://cajonescaballeroback.onrender.com";
  private http = inject(HttpClient);

  enviarOrdenCompra(orden: OrdenCompra): Observable<any> {
    return this.http.post<any>(`${this.url}/pedidos`, orden);
  }

  confirmarPedido(data: { orden: OrdenCompra, email: string }): Observable<any> {
    return this.http.post(`${this.url}/confirmar`, data);
  }

  obtenerPedidos(): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.url}/pedidos`).pipe(
      catchError(error => {
        console.error('Error al obtener los pedidos del usuario:', error);
        return of([] as OrdenCompra[]);
      })
    );
  }

  obtenerPedidosUsuario(usuarioId: string): Observable<OrdenCompra[]> {
    console.log(usuarioId);
    return this.http.get<OrdenCompra[]>(`${this.url}/pedidos/${usuarioId}`).pipe(
      catchError(error => {
        console.error('Error al obtener los pedidos del usuario:', error);
        return of([] as OrdenCompra[]); // Devuelve un arreglo vacío en caso de error
      })
    );
  }

  delPedido(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/pedidos/${id}`);
  }

  updatePedido(id: string, update: any): Observable<any> {
    return this.http.put<any>(`${this.url}/pedidos/${id}`, update);
  }
}
