# Conteúdos

Artigos em português, um arquivo Markdown por texto. O build lê a pasta sozinho: não é preciso registrar rota, sitemap nem menu.

## Onde fica cada coisa

| O quê | Caminho |
| --- | --- |
| Artigo | `client/content/artigos/<slug>.md` |
| Capa | `client/public/images/conteudos/<arquivo>` |
| Autor e revisor | `client/src/content/people.ts` |

O nome do arquivo é o endereço: `memoria-e-rotina.md` publica em `/conteudos/memoria-e-rotina`. O `slug` do frontmatter tem de ser igual ao nome do arquivo.

## Publicar ou esconder

- `draft: true` fica de fora do site publicado, do sitemap, do `llms.txt` e do índice.
- O preview da Vercel e o `npm run dev` mostram o rascunho, para a equipe revisar o modelo.
- O menu **Conteúdos** (cabeçalho e rodapé) só aparece quando existe pelo menos um artigo com `draft: false`.
- `reviewer` é opcional. Sem esse campo, a página não mostra “Revisado por” e o JSON-LD não traz `reviewedBy`.

## Frontmatter

```yaml
---
title: "Título do artigo"
description: "Meta description, no máximo 155 caracteres, sem aspas."
slug: titulo-do-artigo
date: 2026-10-20
updated: 2026-10-20
author: equipe-metis
reviewer: id-em-people-ts
summary: "Resposta curta, em até 300 caracteres, sem HTML."
category: Memória
tags:
  - memoria
  - recife
draft: true
faq:
  - question: "Pergunta visível no fim do texto?"
    answer: "Resposta visível. O mesmo texto entra no schema FAQPage."
related:
  - slug: outro-artigo
  - href: /como-funciona
    label: "Como funciona"
    text: "O circuito semanal de 2h30."
---
```

Texto do artigo em Markdown, depois da segunda linha `---`. Use `##` e `###` para o sumário. Imagem no texto: `![texto alternativo](/images/conteudos/detalhe.jpg)`.

`author` e, quando houver, `reviewer` são os `id` de `people.ts`. `equipe-metis` é a organização Equipe Métis, sem CRM. Um revisor pessoa só entra com nome, CRM-PE e RQE confirmados. Não inventar registro. Se `reviewer` ficar de fora, o artigo publica sem linha de revisão.

`tags` ficam em slug, sem acento. O filtro mostra o nome em português: Atenção, Envelhecimento, Esquecimento, Família, Funções executivas, Memória, Planejamento, Recife. Uma etiqueta nova precisa desse nome em `client/src/content/articles.ts`.

## Imagens

A capa é opcional. Sem `cover`, a página do artigo e o cartão do índice ficam só com texto, nas cores da marca. O Open Graph e o `image` do `BlogPosting` usam o logotipo que o restante do site já usa (`/images/logo-metis-bg-color.jpg`).

Quando houver foto, acrescente:

```yaml
cover: /images/conteudos/titulo-do-artigo.jpg
coverAlt: "Descrição da foto"
coverWidth: 1280
coverHeight: 720
ogImage: /images/conteudos/og/titulo-do-artigo.jpg
```

- A capa entra na página e no cartão. JPG ou WebP, até cerca de 200 KB.
- `coverAlt` é obrigatório junto com `cover`.
- `ogImage` é opcional. Quando existe, `og:image` e `twitter:image` usam essa foto em URL absoluta, com 1200×630. O `image` do `BlogPosting` continua sendo a capa.
- Sem `ogImage`, o Open Graph usa a capa.

## O que a página já faz

Título, meta description, canonical em `https://www.metisacademia.com.br`, Open Graph, JSON-LD (`BlogPosting`, trilha e FAQ quando houver), resposta rápida, sumário, linha de autor, linha de revisor só quando o frontmatter traz `reviewer`, data de atualização, artigos relacionados e o botão de WhatsApp da aula experimental (o mesmo evento `whatsapp_click`).

O aviso de que a Métis é estímulo cognitivo, e não tratamento, já entra no modelo. Não prometa cura, prevenção nem resultado garantido (CFM 2.336/2023).
