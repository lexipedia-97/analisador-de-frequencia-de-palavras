import { Injectable } from '@angular/core';

export interface WordFrequency {
  word: string;
  count: number;
  percentageOfLeader: number;
}

export interface AnalysisResult {
  totalWords: number;
  relevantWords: number;
  ignoredWords: number;
  uniqueWords: number;
  ranking: WordFrequency[];
}

const PORTUGUESE_STOPWORDS = new Set([
  'a',
  'à',
  'agora',
  'ainda',
  'além',
  'algum',
  'alguma',
  'algumas',
  'alguns',
  'ante',
  'ao',
  'aos',
  'apenas',
  'após',
  'aquela',
  'aquelas',
  'aquele',
  'aqueles',
  'aquilo',
  'as',
  'às',
  'até',
  'cada',
  'com',
  'como',
  'contra',
  'da',
  'das',
  'de',
  'dela',
  'delas',
  'dele',
  'deles',
  'depois',
  'desde',
  'dessa',
  'dessas',
  'desse',
  'desses',
  'desta',
  'destas',
  'deste',
  'destes',
  'disso',
  'disto',
  'do',
  'dos',
  'e',
  'ela',
  'elas',
  'ele',
  'eles',
  'em',
  'entre',
  'era',
  'eram',
  'essa',
  'essas',
  'esse',
  'esses',
  'esta',
  'está',
  'estão',
  'estas',
  'estava',
  'estavam',
  'este',
  'estes',
  'eu',
  'foi',
  'foram',
  'há',
  'isso',
  'isto',
  'já',
  'lhe',
  'lhes',
  'mais',
  'mas',
  'me',
  'mesma',
  'mesmas',
  'mesmo',
  'mesmos',
  'meu',
  'meus',
  'minha',
  'minhas',
  'muito',
  'na',
  'não',
  'nas',
  'nem',
  'no',
  'nos',
  'nós',
  'nossa',
  'nossas',
  'nosso',
  'nossos',
  'num',
  'numa',
  'o',
  'onde',
  'os',
  'ou',
  'outra',
  'outras',
  'outro',
  'outros',
  'para',
  'pela',
  'pelas',
  'pelo',
  'pelos',
  'por',
  'porque',
  'qual',
  'quando',
  'que',
  'quem',
  'se',
  'sem',
  'seu',
  'seus',
  'só',
  'sob',
  'sobre',
  'sua',
  'suas',
  'também',
  'te',
  'tem',
  'têm',
  'tendo',
  'ter',
  'teve',
  'tinha',
  'tu',
  'tua',
  'tuas',
  'tudo',
  'um',
  'uma',
  'umas',
  'uns',
  'você',
  'vocês',
]);

@Injectable({ providedIn: 'root' })
export class WordAnalyzerService {
  private readonly collator = new Intl.Collator('pt-BR');

  analyze(text: string, limit = 10): AnalysisResult {
    const normalizedText = text.toLocaleLowerCase('pt-BR').replace(/[^\p{L}]+/gu, ' ');
    const words = normalizedText.match(/\p{L}+/gu) ?? [];
    const relevantWords = words.filter((word) => !PORTUGUESE_STOPWORDS.has(word));
    const frequencies = new Map<string, number>();

    for (const word of relevantWords) {
      frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
    }

    const orderedWords = [...frequencies.entries()].sort(
      ([wordA, countA], [wordB, countB]) => countB - countA || this.collator.compare(wordA, wordB),
    );
    const leaderCount = orderedWords[0]?.[1] ?? 0;
    const ranking = orderedWords.slice(0, limit).map(([word, count]) => ({
      word,
      count,
      percentageOfLeader: leaderCount === 0 ? 0 : Math.round((count / leaderCount) * 100),
    }));

    return {
      totalWords: words.length,
      relevantWords: relevantWords.length,
      ignoredWords: words.length - relevantWords.length,
      uniqueWords: frequencies.size,
      ranking,
    };
  }
}
