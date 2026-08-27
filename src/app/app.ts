import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentReaderService } from './document-reader.service';
import { AnalysisResult, WordAnalyzerService } from './word-analyzer.service';

const MAX_TEXT_FILE_SIZE = 15 * 1024 * 1024;

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly analyzer = inject(WordAnalyzerService);
  private readonly documentReader = inject(DocumentReaderService);
  private readonly reportSection = viewChild<ElementRef<HTMLElement>>('reportSection');

  protected readonly fileName = signal('');
  protected readonly fileSize = signal('');
  protected readonly result = signal<AnalysisResult | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly isReading = signal(false);
  protected readonly isDragging = signal(false);

  protected async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    input.value = '';

    if (file) {
      await this.processFile(file);
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  protected async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files.item(0);

    if (file) {
      await this.processFile(file);
    }
  }

  protected clearAnalysis(): void {
    this.fileName.set('');
    this.fileSize.set('');
    this.result.set(null);
    this.errorMessage.set('');
  }

  protected formatCount(count: number): string {
    return `${count} ${count === 1 ? 'vez' : 'vezes'}`;
  }

  private async processFile(file: File): Promise<void> {
    this.errorMessage.set('');

    const normalizedName = file.name.toLocaleLowerCase('pt-BR');
    if (!normalizedName.endsWith('.txt')) {
      this.showError('Formato não aceito. Selecione um arquivo com a extensão .txt.');
      return;
    }

    if (file.size > MAX_TEXT_FILE_SIZE) {
      this.showError('O arquivo de texto ultrapassa 15 MB. Selecione um documento menor.');
      return;
    }

    this.isReading.set(true);

    try {
      const text = await this.documentReader.read(file);

      if (!text.trim()) {
        this.showError('O arquivo está vazio. Selecione um documento que contenha texto.');
        return;
      }

      if (text.includes('\u0000')) {
        this.showError('Não foi possível interpretar o arquivo como texto comum.');
        return;
      }

      const analysis = this.analyzer.analyze(text);

      if (analysis.ranking.length === 0) {
        this.showError('O documento contém apenas conectivos ou caracteres não analisáveis.');
        return;
      }

      this.fileName.set(file.name);
      this.fileSize.set(this.formatFileSize(file.size));
      this.result.set(analysis);
      this.scrollToReport();
    } catch {
      this.showError('Não foi possível ler o arquivo. Tente selecioná-lo novamente.');
    } finally {
      this.isReading.set(false);
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    return `${(bytes / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} KB`;
  }

  private scrollToReport(): void {
    setTimeout(() => {
      const report = this.reportSection()?.nativeElement;
      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      report?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }

  private showError(message: string): void {
    this.errorMessage.set(message);
    this.result.set(null);
    this.fileName.set('');
    this.fileSize.set('');
  }
}
