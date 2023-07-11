import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../../../core/services/auth.service';
import { MyValidators } from 'src/app/utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  register(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      this.authService.createUser(value.email, value.password).then(() => {
        this.router.navigate(['/auth/login']);
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            MyValidators.validPassword,
          ], //Validación personalizada
        ],
        confirmPassword: [
          '',
          [Validators.required], //Validación personalizada
        ],
        // Para validaciones condicionadas (cambian dinámicamente en con la acción del usuario en la UI)
        type: ['company', [Validators.required]],
        companyName: ['', [Validators.required]],
      },
      { validators: MyValidators.matchPassword } //Mi validación grupal, es un objeto diferente que se pasa al formGroup.
    );

    //este sería el escuchar campos del formulario y reaccionar dinamicamente
    this.typeField.valueChanges.subscribe((value) => {
      // seteo o no mis validadores para un formControl en particular
      if (value === 'company') {
        this.companyNameField.setValidators([Validators.required]);
      } else {
        this.companyNameField.setValidators(null);
      }
      // actualizo forzadamente el estado del formControl
      this.companyNameField.updateValueAndValidity();
    });

    console.log(this.getFormValidationErrors(this.form));
  }

  //Getters de formControl
  get typeField() {
    return this.form.get('type');
  }

  get companyNameField() {
    return this.form.get('companyName');
  }

  // Hay un detalle a tener en cuenta con las validaciones en runtime, si la validación nueva es diferente el setValidators no elimina las validaciones anteriores que pudiese tener el campo, si un campo tenia por ejemplo un min = 3 y luego le pones un max = 6 las nuevas validaciones se mezclan, es por ello que para no tener errores con las validaciones en tiempo de ejecución es recomendable ante de aplicar las nuevas validaciones a un control usar el método clearValidators, si están usando versiones de angular 10 o superiores el setValidators(null) no elimina las validaciones presentes.
  // Si tiene errores con las validaciones de un formulario este método los puede ayudar a saber que validaciones se están aplicando a un formulario

  getFormValidationErrors(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(keyError);
        });
      }
    });
  }
}
