import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService {

  #BASE_URL = environment.baseUrl;
  #USER_ENDPOINT = new URL('/api/auth/v1/profiles', this.#BASE_URL);

  constructor(private http: HttpClient) { }

  getUsersByIds(userIds: string[]) {
    let params = new HttpParams();
    for (let id of userIds) {
      params = params.append('uid', id);
    }
    return this.http.get<User[]>(this.#USER_ENDPOINT.toString(), {
      params,
    });
  }
}
