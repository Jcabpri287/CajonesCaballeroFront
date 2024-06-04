import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { usuarioService } from '../../services/usuario.service';
import { LoginService } from '../../services/login.service';
import { NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, NgIf, ReactiveFormsModule, FormsModule, TranslateModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  showModal: boolean = false;
  verificationSentCode: string = '';
  verificationCode: string = '';
  private authService = inject(LoginService)
  private userService = inject(usuarioService)

  constructor(private formBuilder: FormBuilder,private router:Router, private http : HttpClient, private translate: TranslateService) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required, this.validatePassword],
      repetirContrasenia: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required, this.isNumber]
    });
    this.registerForm.get('contraseña')?.valueChanges.subscribe(() => {
      this.registerForm.get('repetirContrasenia')?.setValidators(
        this.repetirPasswordValidator(this.registerForm.get('contraseña')?.value)
      );
      this.registerForm.get('repetirContrasenia')?.updateValueAndValidity();
    });
  }

  validatePassword(control: any): Observable<any> {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
    if (control.value && !passwordPattern.test(control.value)) {
      return of({ invalidPassword: true });
    }
    return of(null);
  }

  isNumber(control: any): Observable<any> {
    const phonePattern = /^[0-9]{9}$/;
    if (control.value && !phonePattern.test(control.value)) {
      return of({ invalidNumber: true });
    }
    return of(null);
  }

  repetirPasswordValidator(contrasenia: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const repetirContraseña = control.value;

      if (contrasenia && repetirContraseña && contrasenia === repetirContraseña) {
        return null;
      } else {
        return { passwordMismatch: true };
      }
    };
  }

  register() {
    this.userService.getCorreos().subscribe(
      response => {
        if (response.includes(this.registerForm.get('correo')?.value) ){
          Swal.fire({
            icon: 'error',
            iconColor: "#8ea7f7",
            title: 'Error',
            confirmButtonColor: "#252525",
            text: this.translate.instant('correo_existente')
          });
        }else{
          this.submitRegister()
        }
      },
      error => {
        console.log(error.error.errors[0].msg);
      }
      );
  }

  submitRegister(){
    this.userService.addUsuario(this.registerForm.value).subscribe(
      response => {
        console.log(response._id);
        console.log(this.registerForm.get('nombre')?.value);
        if (response) {
          this.authService.login(false, "", "",this.registerForm.get('nombre')?.value,response._id,false);
        }
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          iconColor: "#8ea7f7",
          title: this.translate.instant('registrado_correctamente')
        });
        this.router.navigate(['/']);
      },
      error => {
        console.log(error.error.errors[0].msg);
      }
      );
  }

  generateVerificationCode(): string {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min + '';
  }

  sendVerificationEmail() {
    if (this.registerForm.valid) {
      this.verificationSentCode = this.generateVerificationCode();
      this.submitVerificationCode();
      this.openModal();
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitVerificationCode() {
    console.log(this.verificationSentCode + this.registerForm.get('correo')?.value);
    this.http.post<any>('https://cajonescaballeroback.onrender.com/verify-code', { code: this.verificationSentCode ,email : this.registerForm.get('correo')?.value })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  confirmVerificationCode() {
    console.log(this.verificationCode);
    if (this.getVerificationCode() == this.verificationSentCode) {
      this.closeModal();
      this.register();
    }else{
      Swal.fire({
        icon: 'error',
        iconColor: "#8ea7f7",
        title: 'Error',
        confirmButtonColor: "#252525",
        text: this.translate.instant('codigo_erroneo')
      });
    }
  }

  moveToNext(event: any, index: number) {
    const input = event.target;
    if (!input.value && index > 0) {
      const prevInput = document.getElementById(`input${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        return;
      }
    }
    if (input.value && index < 6) {
      const nextInput = document.getElementById(`input${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    this.verificationCode = this.getVerificationCode();
  }

  getVerificationCode(): string {
    let code = '';
    for (let i = 1; i <= 6; i++) {
      const input = document.getElementById(`input${i}`) as HTMLInputElement;
      code += input.value || '';
    }
    return code;
  }
}
