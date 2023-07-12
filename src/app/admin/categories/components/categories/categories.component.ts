import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ['id', 'name', 'creationAt', 'image', 'action'];

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categoriesService
      .getAllCategories()
      .subscribe((data) => (this.categories = data));
  }

  clickedRows = new Set<Category>();

  editarCategoria(event: any) {
    alert('Editar');
  }
  eliminarCategoria(event: any) {
    alert('Editar');
  }

  // TODO: Hacer el estilo del litado
  // TODO: Cambiar el nombre del archivo para que sea random y evite conflicto
  // TODO: Input file mejorado en estetica
}
