import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {MemberListComponent} from "./components/members/member-list/member-list.component";
import {MemberDetailComponent} from "./components/members/member-detail/member-detail.component";
import {ListsComponent} from "./components/lists/lists.component";
import {MessagesComponent} from "./components/messages/messages.component";
import {AuthGuard} from "./_guards/auth.guard";
import {NotFoundComponent} from "./components/_errors/not-found/not-found.component";
import {ServerErrorComponent} from "./components/_errors/server-error/server-error.component";

const routes: Routes = [
  {path:'', component: HomeComponent},
  {
    path:'',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path:'members', component: MemberListComponent, canActivate:[AuthGuard]},
      {path:'members/:username', component: MemberDetailComponent},
      {path:'lists', component: ListsComponent},
      {path:'messages', component: MessagesComponent},
    ]
  },
  {path:'not-found', component: NotFoundComponent},
  {path:'server-error', component: ServerErrorComponent},
  {path:'**', component: NotFoundComponent, pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
