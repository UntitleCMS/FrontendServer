import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Token } from '../models/token';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private readonly baseUrl = environment.baseUrl;
  private readonly tokenEndpoint = new URL('/api/auth/v1/token', this.baseUrl);
  private readonly registerEndpoint = new URL(
    '/api/auth/v1/register',
    this.baseUrl
  );

  constructor(private _http: HttpClient, private _token: TokenService) {}

  login(username: string, password: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let loginData = new URLSearchParams({
      grant_type: 'password',
      username: username,
      password: password,
      scope: 'offline_access openid profile email',
    });

    return this._http
      .post<Token>(this.tokenEndpoint.toString(), loginData, { headers })
      .pipe(tap((res) => (this._token.token = res)));
  }

  register(username: string, password: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let registerData = new URLSearchParams({
      username: username,
      password: password,
    });

    return this._http.post<Token>(
      this.registerEndpoint.toString(),
      registerData,
      { headers }
    );
  }
}
