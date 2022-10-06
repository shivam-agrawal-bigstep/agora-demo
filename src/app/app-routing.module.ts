import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path: '',
  redirectTo: 'landing',
  pathMatch: 'full'},
  {
    path: 'landing',
    loadChildren: () =>
      import('./landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'video/:uid/:channel',
    loadChildren: () =>
      import('./video/video.module').then((m) => m.VideoModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
