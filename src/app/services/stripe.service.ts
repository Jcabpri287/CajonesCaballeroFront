import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe('pk_test_51PH3iTDhgSdzhvGGCvnVPuFCZvl53BmRIBH7sSMWPXckQwjm7O0CsySiPOCOLO8g6pfdetInh607UxJXbheyUkDB00FSpIvhPq').catch(err => {
      return null;
    });
  }

  async procesarPago(producto: { nombre: string, descripcion: string, precio: number }) {
    const stripe = await this.stripePromise;
    if (!stripe) {
      return;
    }

    try {
      const response = await this.http.post<any>('https://cajonescaballeroback.onrender.com/crear-sesion-pago', {
        producto: {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio
        }
      }).toPromise();

      const sessionId = response.sessionId;

      const result = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
    }
  }
}
