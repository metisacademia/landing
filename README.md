# Métis Academia da Mente

O site público fica em `client/`. Os artigos de Conteúdos estão em `client/content/artigos/`. O restante do modelo está em `CONTEUDOS.md`.

## Agendar um artigo

1. Crie `client/content/artigos/<slug>.md` com `draft: false`.
2. Ponha em `date` o dia da publicação, `AAAA-MM-DD`. O dia é o calendário de Recife (UTC−3). Terça ou quinta.
3. Envie o arquivo para `main`. Até essa data, a produção não lista a página, não gera a rota, não entra no sitemap nem no `llms.txt`, e o menu não depende desse texto. O preview da Vercel mostra a página com `noindex` e a faixa “Agendado para DD/MM”.

Na primeira compilação de produção feita nesse dia, o artigo entra no ar. O workflow **Publicar artigos agendados** faz isso terças e quintas às 07:55 em Recife (10:55 UTC): se houver um artigo com data de hoje ou da terça/quinta anterior, ele grava um commit vazio em `main` e a Vercel recompila. Sem artigo nessa janela, o workflow termina sem erro e sem commit. Dá para disparar à mão em Actions, com a opção de forçar o deploy.

O build só avisa, e não falha, quando dois artigos usam a mesma data ou quando a data não é terça nem quinta.
