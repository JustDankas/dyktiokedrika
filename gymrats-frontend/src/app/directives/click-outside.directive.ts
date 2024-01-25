import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  @Output() clickOutside: EventEmitter<void> = new EventEmitter();
  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: any) {
    const clickedEl = this.el.nativeElement.contains(target);
    if (!clickedEl) {
      this.clickOutside.emit();
    }
  }
}
