import { AbstractControl } from '@angular/forms';
import { CategoriesService } from '../core/services/categories.service';
import { map } from 'rxjs/operators';
import { Category } from '../core/models/category.model';

export class MyValidators {
  static isPriceValid(control: AbstractControl) {
    const value = control.value;
    console.log(value);
    if (value > 10000) {
      return { price_invalid: true };
    }
    return null;
  }

  static matchPassword(control: AbstractControl) {
    // control recibe todos los campos del formulario.
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if (password === confirmPassword) {
      return null;
    }
    // si hay error lo mandamos como un objeto clave valor
    return { match_password: true };
  }

  static validPassword(control: AbstractControl) {
    const value = control.value;
    // En una validación Angular dice que si está todo OK debe retornar NULL
    if (!containsNumber(value)) {
      return { invalid_password: true };
    }
    return null;
  }

  // static validateCategory(service: CategoriesService){
  //   // hay que retornar una fn como tal para ser ejecutada luego, Closure.
  //   return (control: AbstractControl) => {
  //     const value = control.value;
  //     return service.checkCategory(value).pipe(
  //       // transformamos al formato que necesita nuestra petición
  //       .map( (response: any) => {
  //         const isAvailable = response.isAvailable;
  //         if (!isAvailable) {
  //           return {not_available: true}
  //         }
  //         return null;
  //       })
  //     )
  //   }
  // }

  //Versión que soluciona la falta de funcionamiento del EP.
  static validateCategory(service: CategoriesService) {
    // hay que retornar una fn como tal para ser ejecutada luego, Closure.
    return (control: AbstractControl) => {
      const valorNuevaCategoria = control.value;
      return service.getAllCategories().pipe(
        // transformamos al formato que necesita nuestra petición
        map((categories) => {
          const noDisponible = categories.find(
            (category) =>
              category.name.toUpperCase() === valorNuevaCategoria.toUpperCase()
          );
          if (noDisponible === undefined) {
            return null;
          }
          return { not_available: true };
        })
      );
    };
  }
}

function containsNumber(value: string) {
  return value.split('').find((v) => isNumber(v)) !== undefined;
}

function isNumber(value: string) {
  return !isNaN(parseInt(value, 10));
}
