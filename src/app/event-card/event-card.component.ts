import { Component, ElementRef, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { EventData } from '../admin/module';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LocalstorageService } from '../services/localstorage.service';
import { animate, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, MatIconModule, CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent implements OnInit {
  //Inputs
  eventId = input<string>();
  event = input<EventData>();
  targetId = input<string>();
  //Outputs
  editEvent = output<string>();
  deleteEvent = output<string>();
  inspect = signal(false);
  inspectIn = signal(false);
  requiredSpace = input<number>();
  iconPosotion = signal('0');
  popupPosition = signal<{top?: string, right?: string, bottom?: string, left?: string, transform?: string, rotate?:string}>({});
  @ViewChild('inspectBtn') inspectBtn ?:ElementRef<HTMLButtonElement>;

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      this.calculateOptimalPosition();
    });
    window.addEventListener('resize', () => {
      this.calculateOptimalPosition();
    });
  }

  private localStorage = inject(LocalstorageService);
  today = new Date();
  userRole = JSON.parse(this.localStorage.getItem('user')!);
  isFuterEvent(date: string):boolean {
    this.today.setHours(0,0,0,0)
    return new Date(date).getTime() >= this.today.getTime();
  }

  toggleInInspect() {
    this.inspectIn.update((value) => {
      setTimeout(() => {
        this.inspect.set(!this.inspect());
      },400);
      return !value
    })
  }
  
  toggleInspect() {
    this.inspect.update((value) => {
      if(!value) {
        this.calculateOptimalPosition();
      }
        setTimeout(() => {
          this.inspectIn.set(!this.inspectIn());
        },100)
      return !value;
    });
  }

  calculateOptimalPosition(): void {
    if (!this.inspectBtn) return;
    
    const buttonRect = this.inspectBtn.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate available space in each direction
    const spaceRight = viewportWidth - buttonRect.right - 20; // Subtract padding
    const spaceLeft = buttonRect.left - 20;
    const spaceTop = buttonRect.top - 20;
    const spaceBottom = viewportHeight - buttonRect.bottom - 20;

    const position: {top?: string, right?: string, bottom?: string, left?: string, transform?: string, rotate?:string} = {};

    if (spaceRight > this.requiredSpace()!) {
      // Position to the right
      position.left =  `${buttonRect.right + 10}px`;
      position.top = `${buttonRect.top + (buttonRect.height/2) - (this.requiredSpace()!/1.2)}px`;
      position.transform = 'translateY(-50%)';
      position.rotate = '180deg';
      this.iconPosotion.set(`${buttonRect.top}px`)
    } else if (spaceLeft > this.requiredSpace()!) {
      // Position to the left
      position.top = `${buttonRect.top + (buttonRect.height/2) - (this.requiredSpace()!/1.2)}px`;
      position.right = `${viewportWidth - buttonRect.left + 10}px`;
      position.transform = 'translateY(-50%)';
      position.rotate = '0deg';
      // this.iconPosotion.set(`${}`)
    } else if (spaceTop > this.requiredSpace()!) {
      // Position above
      position.bottom = `${viewportHeight - buttonRect.top + 10}px`;
      position.left = `${buttonRect.left + (buttonRect.width/2) - (this.requiredSpace()!/2)}px`;
      position.transform = 'translateX(-50%)';
      position.rotate = '90deg';
      // this.iconPosotion.set(`${}`)
    } else {
      // Position below
      position.top = `${buttonRect.bottom + 10}px`;
      position.left = `${buttonRect.left + (buttonRect.width/2) - (this.requiredSpace()!/2)}px`;
      position.transform = 'translateX(-50%)';
      position.rotate = '270deg';
      // this.iconPosotion.set(`${}`)
    }
    this.popupPosition.set(position);
  }
}
