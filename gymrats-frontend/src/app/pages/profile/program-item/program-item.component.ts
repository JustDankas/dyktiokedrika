import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-program-item',
  templateUrl: './program-item.component.html',
  styleUrls: ['./program-item.component.scss'],
})
export class ProgramItemComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() image = '';
  @Input() cancelled = false;
  @Output() onCancelled = new EventEmitter<void>();

  onClick() {
    this.onCancelled.emit();
  }
}
