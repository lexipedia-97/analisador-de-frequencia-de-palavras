import { TestBed } from '@angular/core/testing';
import { DocumentReaderService } from './document-reader.service';

describe('DocumentReaderService', () => {
  it('lê diretamente o conteúdo de arquivos TXT', async () => {
    const service = TestBed.inject(DocumentReaderService);
    const file = new File(['Pesquisa qualitativa'], 'entrevista.txt', { type: 'text/plain' });

    await expect(service.read(file)).resolves.toBe('Pesquisa qualitativa');
  });
});
