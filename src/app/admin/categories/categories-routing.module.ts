import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesComponent } from './components/categories/categories.component';
// import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryComponent } from './containers/category/category.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
  },
  // Ahora la lógica la hace el componente smart CategoryComponent y ya no CategoryFormComponent
  {
    path: 'create',
    component: CategoryComponent,
  },
  {
    path: 'edit/:id',
    component: CategoryComponent,
  },
  // {
  //   path: 'create',
  //   component: CategoryFormComponent
  // },
  // {
  //   path: 'edit/:id',
  //   component: CategoryFormComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
