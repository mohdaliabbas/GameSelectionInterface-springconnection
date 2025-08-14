import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HelloService {
  private apiUrl = 'http://localhost:8080/api/hello';

  constructor(private http: HttpClient) { }

  getHelloMessage(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' }).pipe(
      catchError(error => {
        console.log('Spring Boot not running, showing demo message');
        return of('Hello from Spring Boot! (Demo - Install JDK to run actual backend)');
      })
    );
  }
}
