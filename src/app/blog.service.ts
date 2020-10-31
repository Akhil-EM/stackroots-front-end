import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from 'angular-web-storage';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  baseURL = "http://localhost:3000";

  constructor(private http: HttpClient, public local: LocalStorageService) { }
  createHeaders(token) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Token " + token
    });
    let options = { headers: headers };
    return options;
  }

  public getLocalStorage() {
    return { token: this.local.get('token'), userId: this.local.get('userId') };
  }
  public setLocalStorage(logData): void {
    this.local.set("token", logData.token);
    this.local.set("userId", logData.userId);
  }
  public clearLocalStorage(): void {
    this.local.clear();
  }

  login(user) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + "/login", user, { headers: headers });
  }

  getBlogData() {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + "/blog", {}, { headers: headers });
  }

  addBlogPost(blogData) {
    let logData = this.getLocalStorage();
    let headers = new HttpHeaders({
      'Authorization': "Token " + logData.token
    });
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const formData: FormData = new FormData();
    formData.append('blogTitle', blogData.blogTitle);
    formData.append('blogContent', blogData.blogContent);
    formData.append('blogLinks', blogData.blogLinks);
    formData.append('file', blogData.file);
    return this.http.post(this.baseURL + "/blog/add", formData, { headers: headers });
  }

  editBlogPost(editPost) {
    let logData = this.getLocalStorage();
    // editPost.userId = logData.userId;
    let options = this.createHeaders(logData.token);
    console.log("edit  " + editPost);
    return this.http.post(this.baseURL + "/blog/edit", editPost, options);
  }

  deleteBlog(deletePost) {
    let logData = this.getLocalStorage();
    let options = this.createHeaders(logData.token);
    console.log(options);
    return this.http.post(this.baseURL + "/blog/delete", { blogId: deletePost, userId: logData.userId }, options);
  }
  sendMail(sendMail) {
    console.log(sendMail);
    return this.http.post(this.baseURL + "/contactus", sendMail);
  }

}
