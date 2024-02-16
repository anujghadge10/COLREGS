import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CourseDetailsComponent } from '../user/components/course-details/course-details.component';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard
  implements CanDeactivate<CourseDetailsComponent>
{
  async canDeactivate(component: CourseDetailsComponent): Promise<boolean> {
    // console.log(component.isVideoPlaying);
    //
    if (component.isVideoPlaying) {
      await component.saveVideoProgress();
      return true; // or return a boolean or a Promise<boolean> based on your logic
    }
    return true;
  }
}
