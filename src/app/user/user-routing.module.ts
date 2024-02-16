import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { UserComponent } from './user.component';
import { AssesmentsComponent } from './components/assesments/assesments.component';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'course-details',
        component: CourseDetailsComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { breadcrumb: 'Assigned Courses > Course Details' },
      },
      {
        path: 'assesments',
        component: AssesmentsComponent,
        data: {},
      },

      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {},
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
