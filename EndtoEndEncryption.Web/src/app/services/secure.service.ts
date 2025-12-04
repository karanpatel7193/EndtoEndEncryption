import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root' 
    })
export class SecureService {
    constructor(private http: HttpClient) {
    }
    private apiUrl = 'https://localhost:44382/api/secure/'

    public GetServerPublicKey(): Observable<any> {
        return this.http.get<any>(this.apiUrl + 'public-key').pipe(
            map((response: any) => {
                return response;
            }),
            catchError(async (error) => {console.log(error); throw error; })
        );
    }
}