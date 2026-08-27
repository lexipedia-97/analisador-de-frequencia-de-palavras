import { TestBed } from '@angular/core/testing';
import { WordAnalyzerService } from './word-analyzer.service';

describe('WordAnalyzerService', () => {
  let service: WordAnalyzerService;

  beforeEach(() => {
    service = TestBed.inject(WordAnalyzerService);
  });

  it('normaliza maiúsculas, remove pontuação e ignora stopwords', () => {
    const result = service.analyze('Brasil, brasil! BRASIL. Pesquisa? pesquisa; de que a.');

    expect(result.totalWords).toBe(8);
    expect(result.relevantWords).toBe(5);
    expect(result.ignoredWords).toBe(3);
    expect(result.uniqueWords).toBe(2);
    expect(result.ranking).toEqual([
      { word: 'brasil', count: 3, percentageOfLeader: 100 },
      { word: 'pesquisa', count: 2, percentageOfLeader: 67 },
    ]);
  });

  it('preserva letras acentuadas da língua portuguesa', () => {
    const result = service.analyze('Educação, educação e ação.');

    expect(result.ranking[0]).toEqual({ word: 'educação', count: 2, percentageOfLeader: 100 });
    expect(result.ranking[1]).toEqual({ word: 'ação', count: 1, percentageOfLeader: 50 });
  });

  it('limita o relatório às dez palavras mais frequentes', () => {
    const result = service.analyze(
      'alfa beta gama delta epsilon zeta eta theta iota kappa lambda pesquisa pesquisa',
    );

    expect(result.ranking).toHaveLength(10);
    expect(result.ranking[0].word).toBe('pesquisa');
    expect(result.ranking[0].count).toBe(2);
  });

  it('retorna um relatório vazio quando não há termos relevantes', () => {
    const result = service.analyze('a e o de que para');

    expect(result.relevantWords).toBe(0);
    expect(result.uniqueWords).toBe(0);
    expect(result.ranking).toEqual([]);
  });
});
