import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  submitted = false;
  submitted2 = false;
  login: boolean;
  sendMail: any = {};
  spinner = false;



  constructor(private formBuilder: FormBuilder, private blogService: BlogService, private router: Router) { }

  ngOnInit(): void {
    let logData = this.blogService.getLocalStorage();
    if (logData.token) {
      this.login = true;
    }
    else {
      this.login = false;
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required]]
    });
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

  }

  get f() { return this.loginForm.controls; }
  get fc() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid == true) { return; }
   // console.log(this.loginForm.value);
    let user = {
      userName: this.loginForm.get("email").value,
      password: this.loginForm.get("password").value
    }
    this.blogService.login(user).subscribe((result) => {
      let data = JSON.parse(JSON.stringify(result));
      if (data.status == "Success") {
        this.blogService.setLocalStorage(data.user);
        this.login = true;
        alert(data.status);
        this.submitted = false;
        this.loginForm.reset();
        document.getElementById("closeButton").click();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['home']);
        });
      }
      else {
        alert(data.status);
      }
    });
  }


  mail() {
    this.submitted2 = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.spinner = true;
    this.sendMail.name = this.registerForm.get('name').value;
    this.sendMail.email = this.registerForm.get('email').value;
    this.sendMail.message = this.registerForm.get('message').value;
    this.blogService.sendMail(this.sendMail).subscribe((result) => {
      if (JSON.parse(JSON.stringify(result)).status == "Success") {
        alert("Success");
      }
      else {
        alert("Failed");
      }
      this.spinner = false;
      this.submitted2 = false;
      this.registerForm.reset();
    });
  }
  logout() {
    this.blogService.clearLocalStorage();
    this.login = false;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['home']);
    });
  }

}
