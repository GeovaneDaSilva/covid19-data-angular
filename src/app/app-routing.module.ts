import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'covid-data',
    loadChildren: () => import('./features/covid/covid.module').then(m => m.CovidModule)
  },
  { path: '', redirectTo: '/covid-data', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
