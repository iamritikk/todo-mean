import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

const API_BASE_URL = environment.apiUrl + 'users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null;
  private authStatusListner = new Subject<boolean>();
  private authStatus = false;
  tokenTimer: any;
  private userId: any;

  constructor(private http: HttpClient, private router: Router) {}
  getAuthStatus() {
    return this.authStatus;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  createUser(authData: AuthData) {
    this.http.post(API_BASE_URL + '/signup', authData).subscribe(
      (resp) => {
        console.log(resp);
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
        this.authStatusListner.next(false);
      }
    );
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (authInfo) {
      const expiresIn =
        authInfo.expirationDate.getTime() - new Date().getTime();
      if (expiresIn > 0) {
        this.token = authInfo.token;
        this.authStatus = true;

        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiresIn);
        this.authStatusListner.next(true);
      }
    }
  }

  login(authData: AuthData) {
    this.http
      .post<{
        status: {};
        data: { token: string; expiresIn: number; userId: string };
      }>(API_BASE_URL + '/login', authData)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.token = resp.data.token;
          if (this.token) {
            const expiresIn = resp.data.expiresIn;
            this.tokenTimer = setTimeout(() => {
              this.logout();
            }, expiresIn * 1000);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);
            this.userId = resp.data.userId;
            this.saveAuthData(this.token, expirationDate, this.userId);
            this.authStatusListner.next(true);
            this.authStatus = true;
            this.router.navigate(['/']);
          }
        },
        (error) => {
          console.log(error);
          this.authStatusListner.next(false);
        }
      );
  }
  logout() {
    this.token = null;
    this.userId = null;
    this.authStatus = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.cleartAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private cleartAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(): any {
    const token = localStorage.getItem('token');
    const expirationDate: any = localStorage?.getItem('expiration');
    const userId = localStorage?.getItem('userId');
    if (token) {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId,
      };
    }
  }
}
