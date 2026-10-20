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
- Não publique o arquivo `exemplo-rascunho.md`. Ele é só o modelo.

## Frontmatter

```yaml
---
title: "Título do artigo"
description: "Meta description, no máximo 155 caracteres, sem aspas."
slug: titulo-do-artigo
date: 2026-10-20
updated: 2026-10-20
author: id-em-people-ts
reviewer: id-em-people-ts
summary: "Resposta curta, em até 300 caracteres, sem HTML."
cover: /images/conteudos/titulo-do-artigo.jpg
coverAlt: "Descrição da foto"
coverWidth: 1200
coverHeight: 630
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

`author` e `reviewer` são os `id` de `people.ts`. Enquanto o nome, o CRM-PE e o RQE não estiverem confirmados pela própria pessoa, use um perfil marcado como placeholder. Não inventar registro.

## Imagens

- Capa recomendada: **1200×630**, JPG ou WebP, até cerca de 250 KB.
- Caminho público, começando com `/images/...`.
- `coverAlt` é obrigatório.
- `coverWidth` e `coverHeight` são opcionais e alimentam as tags Open Graph.

## O que a página já faz

Título, meta description, canonical em `https://www.metisacademia.com.br`, Open Graph, JSON-LD (`BlogPosting`, trilha e FAQ quando houver), resposta rápida, sumário, linha de autor e de revisor, data de atualização, artigos relacionados e o botão de WhatsApp da aula experimental (o mesmo evento `whatsapp_click`).

O aviso de que a Métis é estímulo cognitivo, e não tratamento, já entra no modelo. Não prometa cura, prevenção nem resultado garantido (CFM 2.336/2023).
