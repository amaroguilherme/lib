import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorService } from 'src/app/core/services/error.service';
import { takeWhile } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  configs = {
    isLogin: true,
    actionText: 'SignIn',
    buttonActionText: 'Create account',
    isLoading: false
  }

  private nameControl = new FormControl('', [Validators.required, Validators.minLength(5)])
  private alive =  true;

  constructor(
    public authService: AuthService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private router : Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  onSubmit(): void {
    console.log(this.loginForm.value);

    this.configs.isLoading = true;

    const operation =
      (this.configs.isLogin)
        ? this.authService.signinUser(this.loginForm.value)
        : this.authService.signupUser(this.loginForm.value);

    operation.pipe(takeWhile(() => this.alive))
    .subscribe(res => {
      const redirect: string = this.authService.redirectUrl || '/dashboard';
      // TO DO: redirect with router logic
      console.log('redirecting...', redirect);

      this.authService.isAuthenticated.pipe(takeWhile(() => this.alive)).subscribe((is: boolean) => {
        if (is) {
          this.router.navigate([redirect]);
          this.authService.redirectUrl = null;
          this.configs.isLoading = false;
        }
      });
    },
    err => {
      console.log(err);
      this.configs.isLoading = false;
      this.snackBar.open(this.errorService.getErrorMessage(err), 'Done', {duration: 5000, verticalPosition: 'top'});
    })
  }

  onKeepSigned(): void {
    this.authService.toggleKeepSigned();
  }
  changeAction(): void {
    this.configs.isLogin = !this.configs.isLogin;
    this.configs.actionText = !this.configs.isLogin ? 'SignUp' : 'SignIn';
    this.configs.buttonActionText = !this.configs.isLogin ? 'Already have an account' : 'Create account';
    !this.configs.isLogin ? this.loginForm.addControl('name', this.nameControl) : this.loginForm.removeControl('name');
  }

  get name(): FormControl {
    return <FormControl>this.loginForm.get('name');
  }
  get email(): FormControl {
    return <FormControl>this.loginForm.get('email');
  }
  get password(): FormControl {
    return <FormControl>this.loginForm.get('password');
  }
}
