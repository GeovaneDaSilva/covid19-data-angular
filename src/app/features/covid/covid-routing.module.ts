import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CovidTableComponent } from './components/covid-table/covid-table.component';

const routes: Routes = [
  { path: '', component: CovidTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CovidRoutingModule { }
