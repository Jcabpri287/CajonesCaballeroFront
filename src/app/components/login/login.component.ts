  import { ChangeDetectorRef, Component, NgModule, NgZone, OnInit, inject } from '@angular/core';
  import { HeaderComponent } from '../header/header.component';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { usuarioService } from '../../services/usuario.service';
  import { NgIf } from '@angular/common';
  import { Router, RouterLink } from '@angular/router';
  import { LoginService } from '../../services/login.service';
  import Swal from 'sweetalert2';
  import CryptoJS from 'crypto-js';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';
import { first } from 'rxjs';

  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [TranslateModule, HeaderComponent, NgIf,ReactiveFormsModule, RouterLink, FooterComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
  })
  export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    private userService = inject(usuarioService)
    private authService = inject(LoginService)
    rememberPassword: boolean = false;

    constructor(private formBuilder: FormBuilder,private router: Router,private translate: TranslateService, private cd: ChangeDetectorRef,
      private ngZone: NgZone) {
      this.loginForm = this.formBuilder.group({
        correo: ['', [Validators.required, Validators.email]],
        contraseña: ['', Validators.required],
        rememberPassword: ['']
      });
    }

    ngOnInit(): void {
      const storedPassword = this.authService.getStoredPassword();
      const storedMail = this.authService.getStoredMail();
      if (storedPassword) {
        this.loginForm.patchValue({
          contraseña: CryptoJS.AES.decrypt(storedPassword, 'secret key').toString(CryptoJS.enc.Utf8),
          correo:storedMail,
          rememberPassword: true
        });
      }

    }

    login() {
      if (this.loginForm.valid) {
        const correo = this.loginForm.get('correo')?.value;
        const contraseña = this.loginForm.get('contraseña')?.value;
        var checked = this.loginForm.get('rememberPassword')?.value;

        if (!checked) {
          checked = false;
        }

        this.userService.loginUsuario(correo, contraseña).subscribe(
          response => {
            if(response._id){
              if (response.rol == "admin") {
                this.authService.login(checked, CryptoJS.AES.encrypt(contraseña, 'secret key').toString(), correo, response.nombre, response._id,true);
              }else{
                this.authService.login(checked, CryptoJS.AES.encrypt(contraseña, 'secret key').toString(), correo, response.nombre, response._id,false);
              }
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

            this.router.navigate(['/']).then(() => {
              this.ngZone.onStable.asObservable().pipe(first()).subscribe(() => {
                this.cd.detectChanges();
                window.scrollTo(0, 0);
                window.location.reload();
                localStorage.setItem('showToastLogin', 'true');
              });
            });
          },
          error => {
            Swal.fire({
              icon: 'error',
              iconColor: "#8ea7f7",
              title: 'Error',
              confirmButtonColor: "#252525",
              text: this.translate.currentLang === 'es' ? 'Ha ocurrido un error' :
                    this.translate.currentLang === 'en' ? 'An error has occurred' :
                    'Si è verificato un errore'
          });
          }
        );
      }
    }
  }
