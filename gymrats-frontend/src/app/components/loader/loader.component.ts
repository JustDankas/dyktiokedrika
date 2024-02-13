import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  loading$!: BehaviorSubject<boolean>;
  constructor(private loaderService: LoaderService) {
    this.loading$ = loaderService.loading$;
  }
}
