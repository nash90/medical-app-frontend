import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './service/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    // loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    // canActivate: [AuthGuardService]
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  { path: 'register',
    loadChildren: './auth/register/register.module#RegisterPageModule'
  },
  { path: 'login',
    loadChildren: './auth/login/login.module#LoginPageModule'
  },
  { path: 'drug-select',
    loadChildren: './pages/drug-select/drug-select.module#DrugSelectPageModule',
    canActivate: [AuthGuardService]
  },
  { path: 'menu',
    loadChildren: './pages/menu/menu.module#MenuPageModule',
    canActivate: [AuthGuardService]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
