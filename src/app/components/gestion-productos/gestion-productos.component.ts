import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { productoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
import { NgFor, NgIf } from '@angular/common';
import { marcaService } from '../../services/marca.service';
import { Marca } from '../../interfaces/marca';
import { SpinnerService } from '../../services/spinner-service.service';
import Swal from 'sweetalert2';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, NgIf, NgFor, FooterComponent],
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit {
  marcas: Marca[] = [];
  productoForm: FormGroup;
  selectedFile: File | null = null;

  cargarMarcas(): void {
    this.marcaService.getMarcas().subscribe(marcas => {
      this.marcas = marcas;
    }, error => {
    });
  }

  constructor(private fb: FormBuilder, private productoService: productoService, private marcaService: marcaService, private spinnerService: SpinnerService) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      marca_id: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      imagen_url: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarMarcas();
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      Swal.fire("Por favor, complete todos los campos requeridos");
      return;
    }
    if (!this.selectedFile) {
      Swal.fire("Por favor, seleccione una imagen para el producto");
      return;
    }

    this.spinnerService.show();
    const nuevoProducto: Producto = {
      ...this.productoForm.value,
      fecha_lanzamiento: new Date()
    };

    this.productoService.addProducto(nuevoProducto).subscribe(response => {
      this.spinnerService.hide();
      Swal.fire("Producto añadido al carrito satisfactoriamente");
    }, error => {
      this.spinnerService.hide();
      Swal.fire("Error al añadir el producto");
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productoForm.patchValue({ imagen_url: `/assets/img/design/${file.name}` });
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.productoForm.patchValue({ imagen_url: '' });
    }
  }
}
