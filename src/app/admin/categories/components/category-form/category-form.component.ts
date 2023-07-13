import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CategoriesService } from './../../../../core/services/categories.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MyValidators } from 'src/app/utils/validators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  image$: Observable<string>;
  categoryId: string;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private router: Router,
    private storage: AngularFireStorage,
    private activatedRoute: ActivatedRoute //para leer parámetros que vienen en la ruta
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.categoryId = params.id;
      if (this.categoryId) {
        this.getCategory();
      }
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.min(4)],
        MyValidators.validateCategory(this.categoriesService), //async - le tengo que mandar el servicio
      ],
      image: ['', Validators.required],
    });
  }

  get nameField() {
    return this.form.get('name');
  }

  get imageField() {
    return this.form.get('image');
  }

  save() {
    if (this.form.valid) {
      // Si hay :id es edición, sino creación
      this.categoryId ? this.updateCategory() : this.createCategory();
    } else {
      this.form.markAllAsTouched();
    }
  }

  // uploadFile(event: any) {
  //   const image = event.target.files[0];
  //   const name = image.name;
  //   const ref = this.storage.ref(name);
  //   const task = this.storage.upload(name, image);

  //   // nos da un observable que podemos leer los cambios
  //   task
  //     .snapshotChanges()
  //     .pipe(
  //       finalize(() => {
  //         const urlImage$ = ref.getDownloadURL();
  //         urlImage$.subscribe((url) => {
  //           console.log(url);
  //           // lleno el formControl
  //           this.imageField.setValue(url);
  //         });
  //       })
  //     )
  //     .subscribe();
  // }

  // para la modificación en el html
  uploadFile(event: any) {
    const image = event.target.files[0];
    const name = image.name;
    const ref = this.storage.ref(name);
    const task = this.storage.upload(name, image);

    // nos da un observable que podemos leer los cambios
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.image$ = ref.getDownloadURL();
          this.image$.subscribe((url) => {
            console.log(url);
            // lleno el formControl
            this.imageField.setValue(url);
          });
        })
      )
      .subscribe();
  }

  //Podría poner un Toastr para avisar que se creo correctamente. Lo normal es hacer redirección cuando se creo el recurso.
  private createCategory() {
    const data = this.form.value;
    this.categoriesService.createCategory(data).subscribe(
      (result) => {
        if (result) {
          this.router.navigate(['/admin/categories']);
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  //Podría poner un Toastr para avisar que se actualizó correctamente. Método cuando entro por EDIT
  private updateCategory() {
    const data = this.form.value;
    this.categoriesService.updateCategory(this.categoryId, data).subscribe(
      (result) => {
        if (result) {
          this.router.navigate(['/admin/categories']);
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  private getCategory() {
    this.categoriesService.getCategory(this.categoryId).subscribe((data) => {
      console.log(data);
      // Acá actualizo todo el form de una
      this.form.patchValue(data);
      // La otra opción es campo a campo this.nameField.setValue(data.name); etc..,etc..
    });
  }
}
