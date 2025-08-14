import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloService } from '../hello.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.css'
})
export class HelloComponent implements OnInit, OnDestroy {
  helloMessage = '';
  isLoading = false;
  connectionStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
  lastUpdated: Date | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private helloService: HelloService) {}

  ngOnInit() {
    this.loadHelloMessage();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadHelloMessage() {
    this.isLoading = true;
    this.connectionStatus = 'disconnected';
    
    this.subscription = this.helloService.getHelloMessage().subscribe({
      next: (message) => {
        this.helloMessage = message;
        this.isLoading = false;
        this.connectionStatus = 'connected';
        this.lastUpdated = new Date();
        console.log('✅ Hello component received message:', message);
      },
      error: (error) => {
        console.error('❌ Hello component error:', error);
        this.helloMessage = 'Unable to connect to Spring Boot backend';
        this.isLoading = false;
        this.connectionStatus = 'error';
        this.lastUpdated = new Date();
      }
    });
  }

  refreshConnection() {
    this.loadHelloMessage();
  }

  getStatusIcon(): string {
    switch (this.connectionStatus) {
      case 'connected': return '🟢';
      case 'disconnected': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  }

  getStatusText(): string {
    switch (this.connectionStatus) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  }

  getLastUpdatedText(): string {
    if (!this.lastUpdated) return 'Never';
    return this.lastUpdated.toLocaleTimeString();
  }
}
