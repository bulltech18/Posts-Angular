import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TokenPaylaod, User, User2 } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators'
import { Token } from '../models/token';
import { Router } from '@angular/router';
import { Post } from '../models/post';
import { Comentario, Comentario2 } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = environment.apiURL;
  token: string;

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient, private router:Router) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiURL}users`, user);
  }

  makeComment(comment: Comentario):Observable<any>{
    return this.http.post(`${this.apiURL}comment`, comment)
  }
  deletePost(id):Observable<any>{
    return this.http.delete(`${this.apiURL}post/delete/${id}`)
  }
  deleteComment(id):Observable<any>{
    return this.http.delete(`${this.apiURL}comm/delete/${id}`)
  }
  getComments(post_id):Observable<any>{

    return this.http.get(`${this.apiURL}comment/get/${post_id}`)
  }

  show(): Observable<any>{
    return this.http.get(`${this.apiURL}posts`);
  }
  post(post:Post):Observable<any>{
    return this.http.post(`${this.apiURL}posts`, post);
  }

  getUser(data): Observable<any>{
    return this.http.post(`${this.apiURL}user/get`, data);
  }

  login(user: User2): Observable<any> {

    let url = `${this.apiURL}login`;

    const base = this.http.post(url, user)

    const request = base.pipe(
        map((data: Token) => {
            if(data.token){
                this.guardarToken(data.token)
            }

            return data
        })
    )

    return request
  }

  private guardarToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }

  public logout(): void{
        
    this.token = ""
    window.localStorage.removeItem('token')
    this.router.navigate(['/login']);
    
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }

    return this.token;
  }
}
