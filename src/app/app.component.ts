import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal/terminal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TerminalComponent],
  template: `
    <app-terminal></app-terminal>
  `,
  styles: []
})
export class AppComponent {
  title = 'profile-webpage';
}
