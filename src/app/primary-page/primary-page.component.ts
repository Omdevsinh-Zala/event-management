import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-primary-page',
  imports: [RouterOutlet],
  templateUrl: './primary-page.component.html',
  styleUrl: './primary-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryPageComponent {

}
