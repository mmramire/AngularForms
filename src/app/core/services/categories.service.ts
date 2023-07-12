import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Category } from './../models/category.model';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.http.get<Category[]>(`${environment.url_api}/categories/`);
  }

  //Notar el uso de Typescript con el Partial para el objeto dto que le paso al servicio
  createCategory(data: Partial<Category>) {
    return this.http.post<Category>(`${environment.url_api}/categories/`, data);
  }

  updateCategory(id: string, data: Partial<Category>) {
    return this.http.post<Category>(
      `${environment.url_api}/categories/${id}`,
      data
    );
  }

  // No funciona el EP
  // checkCategory(name: string) {
  //   return this.http.post(`${environment.url_api}/categories/availabitily`, {name});
  // }
}
