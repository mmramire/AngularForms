import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MyValidators } from './../../../../utils/validators';
import { ProductsService } from './../../../../core/services/products/products.service';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {
  form: FormGroup;
  id: string;
  categories: Category[] = [];

  // Para la parte select dinámico - trabajando con objetos.
  states = [
    { name: 'La Plata', abbrev: 'LP' },
    { name: 'Mar del Plata', abbrev: 'MDQ' },
    { name: 'Capital Federal', abbrev: 'C.A.B.A.' },
    { name: 'Neuquén', abbrev: 'Neu' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getCategories();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id;
      this.productsService.getProduct(this.id).subscribe((product) => {
        // this.form.patchValue(product);
        // Para simular el backend con state lo interceptamos y le agregamos por defecto uno del arrary
        this.form.patchValue({ ...product, state: this.states[1] });
        this.categoryIdField.setValue(product?.category.id);
      });
    });
  }

  saveProduct(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const product = this.form.value;
      console.log('update -> ' + JSON.stringify(product));
      // this.productsService
      //   .updateProduct(this.id, product)
      //   .subscribe((newProduct) => {
      //     console.log(newProduct);
      //     this.router.navigate(['./admin/products']);
      //   });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      price: ['', [Validators.required, MyValidators.isPriceValid]],
      images: [''],
      description: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      state: ['', [Validators.required]],
    });
  }

  get priceField() {
    return this.form.get('price');
  }

  get categoryIdField() {
    return this.form.get('categoryId');
  }

  private getCategories() {
    this.categoriesService.getAllCategories().subscribe(
      (result) => {
        if (result) {
          this.categories = result;
        }
      },
      (error) => {
        console.error(error);
        alert('Algo falló en getCategories()');
      }
    );
  }
}
