import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  constructor(
    private cookieService: CookieService,
    private themeService: ThemeService,
    private router: Router,
    private message: NzMessageService,
    private auth: AuthService
  ) {}
  breadcrumbs: string[] = [];
  Username = '';
  selectedItem: string | null = null;
  isLoggedIn!: any;
  private themeSubscription!: Subscription;
  isDarkTheme!: boolean;

  selectNavItem(item: string): void {
    this.selectedItem = item;
  }

  async logout() {
    await this.cookieService.delete('jwt', '/');
    localStorage.removeItem('jwt');
    localStorage.removeItem('expires_at');
    await this.cookieService.delete('_Remember_me', '/');
    localStorage.removeItem('IsLoggedIn');
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }

  visible = false;
  gotoHome() {
    this.router.navigate([`user/course-details`]);
    this.visible = false;
  }

  scrollTo1() {
    this.router.navigate(['/individual-user/dashboard']);
  }

  Course() {
    this.router.navigate(['user/dashboard']);
  }

  async ngOnInit() {
    const currentTheme = this.themeService.getSavedTheme();
    this.themeSubscription = this.themeService
      .isDarkThemeObservable()
      .subscribe((isDark: boolean) => {
        this.isDarkTheme = isDark;
        if (this.isDarkTheme) {
          // this.message.success('Dark theme applied');
        } else {
          // this.message.info('Light theme applied');
        }
      });

    this.Username = await this.auth.getNameFromTOken();
  }
}
