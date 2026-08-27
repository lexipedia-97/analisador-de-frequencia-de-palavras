# Analisador de Frequência de Palavras

Aplicação web para apoiar pesquisas qualitativas por meio da identificação das palavras mais recorrentes em documentos de texto. O processamento acontece integralmente no navegador: nenhum arquivo é enviado ou armazenado em servidores.

## Funcionalidades

- Importação de arquivos `.txt` por seleção ou arrastar e soltar;
- validação de formato, tamanho e conteúdo do arquivo;
- normalização de letras maiúsculas e minúsculas;
- remoção de números, pontuação e símbolos;
- preservação de letras acentuadas da língua portuguesa;
- filtragem de artigos, preposições, pronomes e outros conectivos comuns;
- apresentação das 10 palavras mais frequentes e suas contagens;
- resumo com total de palavras, termos relevantes, vocabulário e conectivos removidos;
- interface responsiva construída com Angular Material.

## Adaptação dos requisitos

Os requisitos originais descreviam um programa Python executado no terminal. Para viabilizar uma publicação estática e monolítica no Netlify, as mesmas regras foram adaptadas para Angular e TypeScript.

| Requisito original             | Implementação web                                  |
| ------------------------------ | -------------------------------------------------- |
| Caminho de arquivo no terminal | Seletor seguro de arquivo `.txt` no navegador      |
| `str.lower()`                  | `toLocaleLowerCase('pt-BR')`                       |
| Expressão regular em Python    | Expressão regular Unicode em TypeScript            |
| Lista de stopwords             | `Set` de stopwords portuguesas embutido no serviço |
| `collections.Counter`          | Estrutura `Map<string, number>`                    |
| `most_common(10)`              | Ordenação decrescente e `slice(0, 10)`             |
| Impressão no terminal          | Relatório visual, acessível e responsivo           |

## Histórias de usuário atendidas

1. Como pesquisador, posso selecionar um arquivo `.txt` para análise.
2. Como usuário, obtenho a mesma contagem independentemente de letras maiúsculas ou minúsculas.
3. Como usuário, tenho pontuações e símbolos removidos antes da contagem.
4. Como pesquisador, recebo resultados sem conectivos comuns da língua portuguesa.
5. Como analista de dados, visualizo as 10 palavras mais frequentes e suas contagens.

## Tecnologias

- Angular;
- Angular Material;
- TypeScript;
- Vitest;
- Netlify.

## Executar localmente

É necessário ter o Node.js instalado.

```bash
npm install
npm start
```

O aplicativo estará disponível em `http://localhost:4200`.

## Testes e build

```bash
npm test -- --watch=false
npm run build
```

## Publicação no Netlify

O arquivo `netlify.toml` já contém o comando de build, o diretório de publicação e cabeçalhos básicos de segurança. Basta conectar este repositório a um novo projeto no Netlify; as configurações serão identificadas automaticamente.

## Privacidade

A leitura e a análise são feitas pela API de arquivos do próprio navegador. O documento selecionado permanece no dispositivo do usuário e deixa de existir na memória do aplicativo quando a página é atualizada ou fechada.
