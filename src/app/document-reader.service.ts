import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DocumentReaderService {
  read(file: File): Promise<string> {
    return file.text();
  }
}
