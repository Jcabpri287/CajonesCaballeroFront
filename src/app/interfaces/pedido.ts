export interface OrdenCompra {
  _id: string;
  usuario_id: string;
  productos: ProductoOrden[];
  estado: string;
  fecha: Date;
}

export interface ProductoOrden {
  id: string;
  nombre: string;
  descripcion: string;
  tipo_madera: string;
  numero_cuerdas: number;
  cantidad: number;
  precio_unitario: number;
  total: number;
  estado: string;
  fecha: Date;
}
