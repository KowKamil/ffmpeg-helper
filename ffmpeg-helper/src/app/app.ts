import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Filedrop } from './home/components/filedrop/filedrop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Filedrop],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('ffmpeg-helper');
}
