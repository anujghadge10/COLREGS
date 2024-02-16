import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { UserRoutingModule } from './user-routing.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AssesmentsComponent } from './components/assesments/assesments.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [UserComponent, CourseDetailsComponent, AssesmentsComponent, DashboardComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NzLayoutModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    NzDropDownModule,
    NzInputModule,
    NzIconModule,
    NzModalModule,
    NzProgressModule,
    FormsModule,
    ReactiveFormsModule,
    NzToolTipModule,
    NzRateModule,
    NzMessageModule,
  ],
})
export class UserModule {}
