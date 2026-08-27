import { TestBed } from '@angular/core/testing';
import sampleText from '../../texto-exemplo.txt?raw';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('cria o aplicativo', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('apresenta apenas a importação de arquivos de texto', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain('Encontre os temas');
    expect(page.querySelector('input[type="file"]')?.getAttribute('accept')).toContain('.txt');
    expect(page.querySelector('input[type="file"]')?.getAttribute('accept')).not.toContain('.pdf');
  });

  it('envia o arquivo TXT da raiz e exibe o ranking esperado', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const input = page.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([sampleText], 'texto-exemplo.txt', {
      type: 'text/plain',
    });
    const files = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
      [Symbol.iterator]: () => [file].values(),
    } as FileList;
    Object.defineProperty(input, 'files', { configurable: true, value: files });

    input.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.querySelector('#report-title')?.textContent).toContain('palavras');
    expect(page.querySelector('.file-name')?.textContent).toContain('texto-exemplo.txt');
    expect(page.querySelector('.ranking-list')?.textContent).toContain('pesquisa');
    expect(page.querySelector('.ranking-list')?.textContent).toContain('5 vezes');
  });

  it('rola automaticamente até o relatório ao concluir a análise', async () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([sampleText], 'texto-exemplo.txt', { type: 'text/plain' });
    const files = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
      [Symbol.iterator]: () => [file].values(),
    } as FileList;
    Object.defineProperty(input, 'files', { configurable: true, value: files });

    input.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    delete (HTMLElement.prototype as { scrollIntoView?: unknown }).scrollIntoView;
  });
});
