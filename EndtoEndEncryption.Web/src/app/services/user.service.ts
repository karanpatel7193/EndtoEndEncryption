import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';

@Injectable({
    providedIn: 'root' 
    })
export class UserService {
    constructor(private http: HttpClient) {
    }
    private apiUrl = 'https://localhost:44382/api/secure/'

    public Registration(user: UserModel): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'user-data', user).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(async (error) => {console.log(error); throw error; })
        );
    }
}