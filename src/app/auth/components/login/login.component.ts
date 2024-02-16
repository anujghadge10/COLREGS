import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  validateForm!: UntypedFormGroup;
  imageUrl: SafeUrl | null = null;
  resStatus = '';
  resMessage = '';
  companyName?: any;
  passwordVisible = false;
  isValidToken!: boolean;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [''],
    });
  }

  login(): void {
    if (this.validateForm.valid) {
      this.authService
        .login(this.validateForm.value, this.companyName)
        .subscribe(async (res: any) => {
          console.log(res);
          if (res.success === true) {
            localStorage.setItem('IsLoggedIn', 'true');
            let roleFromToken = await this.authService.getRoleFromTOken();
            let role = roleFromToken;
            console.log(role);
            if (role === 'ror-user') {
              this.router.navigate([`user/dashboard`]);
              // this.router.navigate([`user/course-details`]);
            }

            if (role === undefined) {
            }
          } else {
            this.resStatus = res.success.toString();
            this.resMessage = res.message;
          }
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  async redirectAccToRole(): Promise<void> {
    let roleFromToken = await this.authService.getRoleFromTOken();
    if (roleFromToken === 'ror-user') {
      this.router.navigate([`user/course-details`]);
    }
  }

  goToForgotPassword() {
    this.router.navigate([`auth/forgotpassword/${this.companyName}`]);
    this.imageUrl = 'assets/images/Logo with Name to right - Full Colour.png';
  }

  async ngOnInit(): Promise<void> {
    this.isValidToken = await this.authService.validateToken();
    if (this.isValidToken) {
      this.redirectAccToRole();
    }
  }
}
