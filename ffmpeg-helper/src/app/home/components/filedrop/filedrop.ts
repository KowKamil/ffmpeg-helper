import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-filedrop',
  imports: [],
  templateUrl: './filedrop.html',
  styleUrl: './filedrop.css',
})
export class Filedrop {
  public readonly allowedExtensions = input<string[]>([]);
  public readonly allowMultipleFiles = input<boolean>();

  public readonly files = output<File[]>();

  public readonly allowedExtensionsString = 
  computed(()=> this.allowedExtensions().join(','));

  public onFileChange(event: Event) {
    this.handleFilesInput(Array.from(((event.target as HTMLInputElement).files ?? [])));
  }

  public onFileDrop(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.handleFilesInput(Array.from(((event.target as HTMLInputElement).files ?? [])));
  }

  private handleFilesInput(files: File[]){
    this.files.emit(files);
  }
}
