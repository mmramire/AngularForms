import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss'],
})
export class BasicFormComponent implements OnInit {
  form: FormGroup;

  // form = new FormGroup({
  //   name: new FormControl('', [Validators.required, Validators.maxLength(10)]),
  //   email: new FormControl(''),
  //   phone: new FormControl(''),
  //   color: new FormControl('#000000'),
  //   date: new FormControl(''),
  //   age: new FormControl(12),
  //   category: new FormControl(''),
  //   tag: new FormControl(''),
  //   agree: new FormControl(false),
  //   gender: new FormControl(''),
  //   zone: new FormControl(''),
  // });

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit(): void {
    //para escuchar un formControl individual
    this.nameField.valueChanges.subscribe((value) => {
      console.log(value);
    });
    //para escuchar un formGroup completo
    // this.form.valueChanges.subscribe((value) => {
    //   console.log(value);
    // });
  }

  getNameValue() {
    console.log(this.nameField.value);
  }

  save(event: Event): void {
    //También mostrar errores al usuario si el form no es válido
    this.form.markAllAsTouched();
    //La validación en el controlador es importante porque desde el html desde el Inspector pueden desactivar la validación del botón.
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      color: ['#000000'],
      date: [''],
      age: [12, [Validators.required, Validators.min(18), Validators.max(100)]],
      category: [''],
      tag: [''],
      agree: [false, [Validators.requiredTrue]],
      gender: [''],
      zone: [''],
    });
  }

  get nameField() {
    return this.form.get('name');
  }

  get isNameFieldValid() {
    return this.nameField.touched && this.nameField.valid;
  }

  get isNameFieldInvalid() {
    return this.nameField.touched && this.nameField.invalid;
  }

  get emailField() {
    return this.form.get('email');
  }

  get phoneField() {
    return this.form.get('phone');
  }

  get colorField() {
    return this.form.get('color');
  }

  get dateField() {
    return this.form.get('date');
  }

  get ageField() {
    return this.form.get('age');
  }

  get categoryField() {
    return this.form.get('category');
  }

  get tagField() {
    return this.form.get('tag');
  }

  get agreeField() {
    return this.form.get('agree');
  }

  get genderField() {
    return this.form.get('gender');
  }

  get zoneField() {
    return this.form.get('zone');
  }
}
