import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes : Routes = [
    { path: '', redirectTo: '/social-inbox', pathMatch: 'full'}
];

@NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
})

export class LayoutRoutingModule {}