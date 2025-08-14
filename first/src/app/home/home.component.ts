import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Mini Game';
  gameStarted = false;
  score = 0;
  gameType = '';

  startGame(type: string) {
    this.gameType = type;
    this.gameStarted = true;
    this.score = 0;
    console.log(`🎮 Started ${type} game`);
  }

  endGame() {
    this.gameStarted = false;
    this.gameType = '';
    console.log('🏁 Game ended');
  }

  updateScore(points: number) {
    this.score += points;
    console.log(`📊 Score updated: ${this.score}`);
  }
}
