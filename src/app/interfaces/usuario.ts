export interface Usuario {
    _id?: string;
    nombre: string;
    correo: string;
    contraseña: string;
    direccion: string;
    telefono: string;
    rol?: string;
}
