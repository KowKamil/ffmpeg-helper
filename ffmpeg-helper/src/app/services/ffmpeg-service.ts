import { Injectable } from '@angular/core';
import { FFFSType, FFmpeg, FileData } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  private readonly ffmpeg = new FFmpeg();
  private loadPromise?: Promise<void>;

  public async load(): Promise<void> {
    if(this.ffmpeg.loaded){
      return;
    }

    if(!this.loadPromise){
      console.log('Loading FFmpeg...');
      const promise = this.ffmpeg.load({
        classWorkerURL: '/ffmpeg-worker/worker.js',
        coreURL: '/ffmpeg/ffmpeg-core.js',
        wasmURL: '/ffmpeg/ffmpeg-core.wasm'
      }).then(()=> {console.log('FFmpeg loaded.'); return undefined;});

      this.loadPromise = promise.finally(() => {
        this.loadPromise = undefined;
      });
    }

    return this.loadPromise;
  }

  public async createWorkingDirectory(workingDirectory: string){
    await this.ffmpeg.createDir(workingDirectory);
  }

  public async mountFile(file: File, workingDirectory: string){
    console.log('Mounting file:', file.name, 'to', workingDirectory);
    await this.ffmpeg.mount(
      FFFSType.WORKERFS,
      { files: [file] },
      workingDirectory
    ).catch((error) => {
      console.error('Error mounting file:', error);
      throw error;
    }).finally(() => {
      console.log('Mounting completed');
    });
  }

  public async unmount(workingDirectory: string){
    await this.ffmpeg.unmount(
      workingDirectory
    );
  }

  public async runCommand(args: string[]) {
    await this.ffmpeg.exec(args);
  }

  public async getMetadata(inputFile: string): Promise<any> {
    const probeExitCode = await this.probe(inputFile, 'metadata.json');
    if(probeExitCode !== 0){
      throw new Error(`FFmpeg probe command failed with exit code ${probeExitCode}`);
    }
    const metadataJson = await this.ffmpeg.readFile('metadata.json', 'utf8');
    if (typeof metadataJson !== 'string') {
       throw new Error('Expected JSON text from FFprobe');
    }
    const metadata = JSON.parse(metadataJson);
    return metadata;
  }

  public async probeFile(filePath: string){
    const outputFile = `${filePath}_metadata.json`;
    await this.probe(filePath, outputFile);
    const result = await this.readFile(outputFile);
    return result;
  }

  private async probe(inputFile: string, outputFile: string): Promise<any> {
    const result = await this.ffmpeg.ffprobe(
      ['-show_format', '-show_streams', 'of', 'json', '-o', outputFile, inputFile]
    );
    return result;
  }

  private async readFile(filePath: string, encoding: string = 'utf8'){
    return this.ffmpeg.readFile(filePath, encoding);
  }
}
