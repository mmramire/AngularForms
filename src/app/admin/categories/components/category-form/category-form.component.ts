import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MyValidators } from 'src/app/utils/validators';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  image$: Observable<string>;
  isNew = true;

  @Input() set category(data: Category) {
    if (data) {
      this.isNew = false;
      this.form.patchValue(data);
    }
  }
  @Output() create = new EventEmitter();
  @Output() update = new EventEmitter();

  categoryId: string;

  constructor(
    private categoriesService: CategoriesService, //se deja como excepcion en DUMB component por Validador asincrono en Form.
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage
  ) {
    this.buildForm();
  }

  ngOnInit(): void {}

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
      !this.isNew
        ? this.update.emit(this.form.value)
        : this.create.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

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
}
