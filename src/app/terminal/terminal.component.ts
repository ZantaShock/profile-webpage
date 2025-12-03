import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsciiService } from '../services/ascii.service';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="terminal-container">
      <pre class="header">{{ header }}</pre>
      
      <div class="nav">
        <span *ngFor="let item of navItems" 
              class="nav-item" 
              [class.active]="activeItem === item.id"
              [class.separator]="item.isSeparator"
              (click)="!item.isSeparator && selectItem(item.id)"
              (mouseenter)="!item.isSeparator && scramble(item)"
              (mouseleave)="!item.isSeparator && reset(item)">
          {{ item.displayLabel }}
        </span>
      </div>

      <div class="nav-separator">{{ navSeparator }}</div>

      <div class="content-area" #contentArea [style.min-height]="minHeight">
        <pre class="output" [class.cursor]="isTyping">{{ output }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .terminal-container {
      width: fit-content;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    pre {
      margin: 0;
      font-family: inherit;
      white-space: pre;
    }
    .header {
      margin-bottom: 2rem;
      color: var(--highlight-color);
      font-weight: bold;
    }
    .nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      width: 100%;
    }
    .nav-separator {
      width: 100%;
      text-align: center;
      margin-bottom: 1rem;
      color: var(--dim-color);
    }
    .nav-item {
      cursor: pointer;
      transition: all 0.1s;
      user-select: none;
    }
    .nav-item:hover:not(.separator), .nav-item.active:not(.separator) {
      color: var(--highlight-color);
      background-color: rgba(165, 42, 42, 0.1);
    }
    .separator {
      cursor: default;
      color: var(--dim-color);
    }
    .content-area {
      flex-grow: 1;
      padding-bottom: 2rem;
      position: relative;
    }
    .output {
      position: relative;
    }
    .cursor::after {
      content: '█';
      animation: blink 1s step-end infinite;
      display: inline-block;
      width: 0;
      overflow: visible;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `]
})
export class TerminalComponent implements OnInit {
  @ViewChild('contentArea') contentArea!: ElementRef;

  header = '';
  output = '';
  isTyping = false;
  activeItem = 'about';
  minHeight = 'auto';
  navSeparator = '';

  navItems = [
    { id: 'about', label: '[ ABOUT ]', displayLabel: '[ ABOUT ]' },
    { id: 'sep1', label: '|', displayLabel: '|', isSeparator: true },
    { id: 'skills', label: '[ SKILLS ]', displayLabel: '[ SKILLS ]' },
    { id: 'sep2', label: '|', displayLabel: '|', isSeparator: true },
    { id: 'contact', label: '[ CONTACT ]', displayLabel: '[ CONTACT ]' }
  ];

  private scrambleInterval: any;
  private typingTimeout: any;

  constructor(private asciiService: AsciiService) { }

  ngOnInit() {
    this.header = this.asciiService.getHeader();

    // Generate ASCII separator matching header width (89 chars)
    this.navSeparator = '+' + '-'.repeat(87) + '+';

    // Calculate max height
    const maxLines = this.asciiService.getMaxHeight(89);
    this.minHeight = `${maxLines * 1.2}em`;

    this.loadContent('about');
  }

  selectItem(id: string) {
    if (this.activeItem === id) return;
    this.activeItem = id;
    this.loadContent(id);
  }

  loadContent(id: string) {
    if (this.navItems.find(item => item.id === id && (item as any).isSeparator)) return;

    // Cancel any ongoing typing animation
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    const rawText = this.asciiService.getContent(id);
    const text = this.asciiService.createBox(rawText, 89);
    this.output = '';
    this.isTyping = true;
    let i = 0;
    const speed = 3;

    const type = () => {
      if (i < text.length) {
        this.output += text.charAt(i);
        i++;
        try {
          this.contentArea.nativeElement.scrollTop = this.contentArea.nativeElement.scrollHeight;
        } catch (e) { }
        this.typingTimeout = setTimeout(type, speed);
      } else {
        this.isTyping = false;
        this.typingTimeout = null;
      }
    };
    type();
  }

  scramble(item: any) {
    let iterations = 0;
    clearInterval(this.scrambleInterval);

    this.scrambleInterval = setInterval(() => {
      item.displayLabel = item.label
        .split('')
        .map((char: string, index: number) => {
          if (index < iterations) {
            return item.label[index];
          }
          const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iterations >= item.label.length) {
        clearInterval(this.scrambleInterval);
        item.displayLabel = item.label;
      }

      iterations += 1 / 2;
    }, 30);
  }

  reset(item: any) {
    clearInterval(this.scrambleInterval);
    item.displayLabel = item.label;
  }
}
