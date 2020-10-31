import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Blog } from "./blog.model";
import { Router } from "@angular/router";
import * as ClassicEditor from 'src/ckeditor5-build-classic';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {
  blogs: Blog[];
  login: boolean;
  postForm: FormGroup;
  submitted = false;
  file: File = null;
  addPost = true;
  blogLinks = {};
  blogId;
  fileName = "Choose File";
  filePath: String;

  // spinner controls
  spinner = true;


  //  Editor related variables
  public Editor = ClassicEditor;
  public editor = "no data";
  ex;
  blured = false;
  focused = false;


  constructor(private blogService: BlogService, private formBuilder: FormBuilder, private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    let logData = this.blogService.getLocalStorage();
    // console.log(logData);
    if (logData.token) {
      this.login = true;
    }
    else {
      this.login = false;
    }
    this.blogService.getBlogData().subscribe((data) => {
      let result = JSON.parse(JSON.stringify(data));
      if (result.status == "Success") {
        this.blogs = result.blogs;
      }
      else {
        alert(result.status);
      }
      this.spinner = false;
    });
  }


  createForm(): void {
    this.postForm = this.formBuilder.group({
      'blogTitle': new FormControl('', Validators.required),
      'fb': new FormControl('', Validators.required),
      'twitter': new FormControl('', Validators.required),
      'insta': new FormControl('', Validators.required),
      'linkedin': new FormControl('', Validators.required)
    });
  }

  provideValue(blog): void {
    // this.postForm.setValue({'blogTitle':blog.blogTitle});
    this.postForm.get('blogTitle').setValue(blog.blogTitle);
    this.postForm.get('fb').setValue(blog.blogLinks.fb);
    this.postForm.get('twitter').setValue(blog.blogLinks.twitter);
    this.postForm.get('insta').setValue(blog.blogLinks.insta);
    this.postForm.get('linkedin').setValue(blog.blogLinks.linkedin);
    document.getElementById('preview').style.backgroundImage = "url(" + this.blogService.baseURL + blog.blogImage + ")";
    this.editor = blog.blogContent;
  }

  get f() { return this.postForm.controls; }

  fileChange(event): void {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList.item(0);
      const reader = new FileReader();
      this.fileName = this.file.name;
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.filePath = reader.result as String;
        document.getElementById('preview').style.backgroundImage = `url(${this.filePath})`;
      }
    }
  }



  post() {
    this.submitted = true;
    console.log("data   " + this.editor);
    if (this.postForm.invalid) {
      alert("Please fill every field");
      return;
    }

    this.blogLinks = {
      "fb": this.postForm.get('fb').value,
      "twitter": this.postForm.get('twitter').value,
      "insta": this.postForm.get('insta').value,
      "linkedin": this.postForm.get('linkedin').value
    }

    if (this.addPost) {
      // add a post

      if (this.file) {
        this.spinner = true;

        let blogData = {
          'blogTitle': this.postForm.get('blogTitle').value,
          'blogContent': this.editor,
          'blogLinks': JSON.stringify(this.blogLinks),
          'file': this.file
        };

        this.blogService.addBlogPost(blogData).subscribe((data) => {
          let result = JSON.parse(JSON.stringify(data));
          if (result.status == "Success") {
            alert("Success");
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['blog']);
            });
          }
          else {
            //console.log("Err" + result.status);
            alert(result.status);
          }
          this.spinner = false;
        });
      }
      else {
        alert("Choose a file");//if file is empty
      }
    }
    else {
      //update a post
      this.spinner = true;
      let formData = {
        "blogTitle": this.postForm.get('blogTitle').value,
        "blogContent": this.editor,
        "blogLinks": this.blogLinks,
        "blogId": this.blogId
      };
      this.blogService.editBlogPost(formData).subscribe((data) => {
        let result = JSON.parse(JSON.stringify(data));
        if (result.status == "Success") {
          alert("Success");
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['blog']);
          });
        }
        else {
          alert(result.status);
        }
        this.spinner = false;
      });
    }
  }

  edit(blog): void {
    this.addPost = false;
    this.blogId = blog._id;
    this.provideValue(blog);
  }

  delete(blogId) {
    console.log(blogId);
    this.blogService.deleteBlog(blogId).subscribe((result) => {
      alert(JSON.parse(JSON.stringify(result)).status);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['blog']);
      });
    });
  }
}