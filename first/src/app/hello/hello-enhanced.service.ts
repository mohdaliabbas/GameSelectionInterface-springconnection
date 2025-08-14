import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';

export interface HelloResponse {
  message: string;
  timestamp: string;
  status: 'success' | 'error';
}

export interface ConnectionState {
  isConnected: boolean;
  lastMessage: string;
  lastError: string | null;
  retryCount: number;
  lastAttempt: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class HelloEnhancedService {
  private apiUrl = 'http://localhost:8080/api/hello';
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds
  
  private connectionState: ConnectionState = {
    isConnected: false,
    lastMessage: '',
    lastError: null,
    retryCount: 0,
    lastAttempt: null
  };

  constructor(private http: HttpClient) {}

  getHelloMessage(): Observable<string> {
    this.connectionState.lastAttempt = new Date();
    
    return this.http.get(this.apiUrl, { responseType: 'text' }).pipe(
      tap(response => {
        this.connectionState.isConnected = true;
        this.connectionState.lastMessage = response;
        this.connectionState.lastError = null;
        this.connectionState.retryCount = 0;
        console.log('✅ Enhanced service: Successfully connected to Spring Boot');
      }),
      retry({
        count: this.maxRetries,
        delay: (error, retryCount) => {
          this.connectionState.retryCount = retryCount;
          console.log(`🔄 Enhanced service: Retry attempt ${retryCount}/${this.maxRetries}`);
          return timer(this.retryDelay);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.connectionState.isConnected = false;
        this.connectionState.lastError = this.getErrorMessage(error);
        
        console.error('❌ Enhanced service: Connection failed after retries:', error);
        
        // Return a demo message if backend is not available
        return of('Hello from Spring Boot! (Demo - Backend not available)');
      })
    );
  }

  getHelloMessageWithRetry(): Observable<string> {
    return this.getHelloMessage().pipe(
      catchError(error => {
        console.error('❌ Enhanced service: Final error after retry logic:', error);
        return of('Hello from Spring Boot! (Demo - Connection failed)');
      })
    );
  }

  testConnection(): Observable<boolean> {
    return this.http.get(this.apiUrl, { responseType: 'text' }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  resetConnectionState(): void {
    this.connectionState = {
      isConnected: false,
      lastMessage: '',
      lastError: null,
      retryCount: 0,
      lastAttempt: null
    };
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          return 'Network Error: Unable to reach server';
        case 404:
          return 'Not Found: API endpoint not available';
        case 500:
          return 'Server Error: Internal server error';
        case 503:
          return 'Service Unavailable: Backend service down';
        default:
          return `HTTP Error ${error.status}: ${error.message}`;
      }
    }
  }

  // Health check method
  performHealthCheck(): Observable<{ status: 'healthy' | 'unhealthy'; details: string }> {
    return this.testConnection().pipe(
      map(isConnected => ({
        status: isConnected ? 'healthy' : 'unhealthy',
        details: isConnected ? 'Backend is responding' : 'Backend is not responding'
      }))
    );
  }
}
