import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CreateTaskComponent } from './task/create/create.component';
import { ListComponent } from './task/list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'create', component: CreateTaskComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:taskId',
    component: CreateTaskComponent,
    canActivate: [AuthGuard],
  },
  // { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
