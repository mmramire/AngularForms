import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CategoriesService } from './../../../../core/services/categories.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private router: Router,
    private storage: AngularFireStorage
  ) {
    this.buildForm();
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
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
      this.createCategory();
    } else {
      this.form.markAllAsTouched();
    }
  }

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
          const urlImage$ = ref.getDownloadURL();
          urlImage$.subscribe((url) => {
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
}
