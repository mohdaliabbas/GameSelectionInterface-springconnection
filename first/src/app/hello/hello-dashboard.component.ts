import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloEnhancedService, ConnectionState } from './hello-enhanced.service';
import { HelloService } from '../hello.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-hello-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello-dashboard.component.html',
  styleUrl: './hello-dashboard.component.css'
})
export class HelloDashboardComponent implements OnInit, OnDestroy {
  // Basic hello data
  basicHelloMessage = '';
  enhancedHelloMessage = '';
  
  // Connection states
  basicConnectionState: ConnectionState | null = null;
  enhancedConnectionState: ConnectionState | null = null;
  
  // Health check
  healthStatus: 'healthy' | 'unhealthy' | 'checking' = 'checking';
  healthDetails = '';
  
  // Auto-refresh
  autoRefreshEnabled = false;
  autoRefreshInterval = 10000; // 10 seconds
  private autoRefreshSubscription: Subscription | null = null;
  
  // Statistics
  totalRequests = 0;
  successfulRequests = 0;
  failedRequests = 0;
  averageResponseTime = 0;
  
  // Loading states
  isLoadingBasic = false;
  isLoadingEnhanced = false;
  isLoadingHealth = false;

  constructor(
    private helloService: HelloService,
    private helloEnhancedService: HelloEnhancedService
  ) {}

  ngOnInit() {
    this.loadAllData();
    this.performHealthCheck();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  loadAllData() {
    this.loadBasicHello();
    this.loadEnhancedHello();
    this.updateConnectionStates();
  }

  loadBasicHello() {
    this.isLoadingBasic = true;
    this.totalRequests++;
    
    this.helloService.getHelloMessage().subscribe({
      next: (message) => {
        this.basicHelloMessage = message;
        this.isLoadingBasic = false;
        this.successfulRequests++;
        console.log('✅ Basic hello loaded:', message);
      },
      error: (error) => {
        this.basicHelloMessage = 'Error loading basic hello';
        this.isLoadingBasic = false;
        this.failedRequests++;
        console.error('❌ Basic hello error:', error);
      }
    });
  }

  loadEnhancedHello() {
    this.isLoadingEnhanced = true;
    this.totalRequests++;
    
    this.helloEnhancedService.getHelloMessageWithRetry().subscribe({
      next: (message) => {
        this.enhancedHelloMessage = message;
        this.isLoadingEnhanced = false;
        this.successfulRequests++;
        console.log('✅ Enhanced hello loaded:', message);
      },
      error: (error) => {
        this.enhancedHelloMessage = 'Error loading enhanced hello';
        this.isLoadingEnhanced = false;
        this.failedRequests++;
        console.error('❌ Enhanced hello error:', error);
      }
    });
  }

  updateConnectionStates() {
    this.basicConnectionState = this.helloEnhancedService.getConnectionState();
    this.enhancedConnectionState = this.helloEnhancedService.getConnectionState();
  }

  performHealthCheck() {
    this.isLoadingHealth = true;
    this.healthStatus = 'checking';
    
    this.helloEnhancedService.performHealthCheck().subscribe({
      next: (result) => {
        this.healthStatus = result.status;
        this.healthDetails = result.details;
        this.isLoadingHealth = false;
        console.log('🏥 Health check result:', result);
      },
      error: (error) => {
        this.healthStatus = 'unhealthy';
        this.healthDetails = 'Health check failed';
        this.isLoadingHealth = false;
        console.error('❌ Health check error:', error);
      }
    });
  }

  toggleAutoRefresh() {
    if (this.autoRefreshEnabled) {
      this.stopAutoRefresh();
    } else {
      this.startAutoRefresh();
    }
  }

  startAutoRefresh() {
    this.autoRefreshEnabled = true;
    this.autoRefreshSubscription = interval(this.autoRefreshInterval).subscribe(() => {
      this.loadAllData();
      this.performHealthCheck();
    });
    console.log('🔄 Auto-refresh started');
  }

  stopAutoRefresh() {
    this.autoRefreshEnabled = false;
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    console.log('⏹️ Auto-refresh stopped');
  }

  resetStatistics() {
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.averageResponseTime = 0;
    console.log('📊 Statistics reset');
  }

  getSuccessRate(): number {
    if (this.totalRequests === 0) return 0;
    return Math.round((this.successfulRequests / this.totalRequests) * 100);
  }

  getHealthStatusIcon(): string {
    switch (this.healthStatus) {
      case 'healthy': return '🟢';
      case 'unhealthy': return '🔴';
      case 'checking': return '🟡';
      default: return '⚪';
    }
  }

  getHealthStatusClass(): string {
    return `health-${this.healthStatus}`;
  }

  getLastAttemptText(connectionState: ConnectionState | null): string {
    if (!connectionState?.lastAttempt) return 'Never';
    return connectionState.lastAttempt.toLocaleString();
  }
}
