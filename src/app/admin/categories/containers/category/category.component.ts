import { Component, OnInit } from '@angular/core';
import { CategoriesService } from './../../../../core/services/categories.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  category: Category;

  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private activatedRoute: ActivatedRoute //para leer parámetros que vienen en la ruta
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.getCategory(params.id);
      }
    });
  }

  createCategory(data) {
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
  updateCategory(data: any) {
    this.categoriesService
      .updateCategory(this.category.id.toString(), data)
      .subscribe(
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

  private getCategory(id: string) {
    this.categoriesService.getCategory(id).subscribe((data) => {
      this.category = data;
    });
  }
}
