# Mãos que contam histórias

Mini-site estático da exposição da **Métis Academia da Mente** sobre artesãos brasileiros,
inspirada na **Fenearte**. Trinta e três mestres, artistas, artesãos e referências brasileiras,
com páginas de história feitas para leitura confortável — inclusive para o público 60+.

O site é **100% estático e offline**: basta abrir `index.html` no navegador. Sem bibliotecas,
sem CDNs, sem servidor.

---

## Estrutura

```
index.html                 → landing page da exposição
artesaos/<slug>.html       → uma página por artesão/referência (33 páginas)
assets/style.css           → visual editorial premium (paleta Métis)
assets/site.js             → JavaScript mínimo (rolagem suave; opcional)
assets/logo-*.jpg          → logotipos da Métis
data/artesaos.json         → fonte de conteúdo (NÃO editar à mão sem regenerar)
scripts/build.py           → gerador estático (lê o JSON e escreve o HTML)
```

## Como visualizar

- **Mais simples:** dê um duplo clique em `index.html`.
- Ou, com Python instalado, sirva localmente (útil no celular na mesma rede):
  ```bash
  cd exposicao-artesaos-fenearte
  python3 -m http.server 8000
  # abra http://localhost:8000
  ```

## Como regenerar as páginas

Todas as páginas HTML são geradas a partir de `data/artesaos.json`.
Se o conteúdo mudar, rode:

```bash
python3 scripts/build.py
```

Isso reescreve `index.html` e todas as páginas em `artesaos/`.
Não requer nenhuma dependência externa.

---

## Publicação e QR codes (importante)

O JSON traz um endereço sugerido:

```json
"base_url_sugerida": "https://metisacademia.com.br/expo/fenearte/"
```

Já existem QR codes e plaquinhas gerados com esse endereço sugerido:

```text
qrcodes/<slug>.png
qrcodes/<slug>.svg
qrcodes/links.csv
placas/<slug>-placa.png
placas/placas_exposicao_metis_A6.pdf
```

**Antes de imprimir os QR codes finais:**

1. **Publique o site** no endereço definitivo (hospedagem, subdomínio ou pasta pública).
2. **Regere os QR codes** com o endereço real já publicado:
   ```bash
   python3 scripts/generate_qr.py --base-url https://SEU-ENDERECO-REAL/
   ```
3. Cada QR code deve apontar para:
   ```
   <base_url>/artesaos/<slug>.html
   ```
   Exemplo: `https://metisacademia.com.br/expo/fenearte/artesaos/manoel-eudocio.html`
4. **Teste cada QR code** com um celular real antes da tiragem definitiva das plaquinhas.
5. Confira o conteúdo de cada página (ver **Nota curatorial** abaixo).

Os `slug` de cada artesão estão em `data/artesaos.json` e são os nomes dos arquivos em `artesaos/`.

## Fotos dos artesãos, peças e Instagram

As fotos principais dos perfis devem ser retratos ou registros dos próprios artesãos/artistas,
não fotos de peças. Cada foto principal mantém legenda, crédito e link de fonte no campo
`imagem` de `data/artesaos.json`. Quando não houver retrato público confiável, o site mantém
um placeholder explícito de **foto do artesão em pesquisa**, sem substituir por peça nem por
imagem de pessoa relacionada.

A galeria/carrossel fica depois de **Para observar na peça** e **Materiais e técnica** e funciona
como **galeria de peças e referências de estilo**: obras e peças públicas coletadas da internet
para ajudar o visitante a reconhecer linguagem, materiais e técnica. As peças da exposição
continuam disponíveis apenas ao vivo.

Quando houver Instagram oficial, institucional ou familiar confirmado, o campo `instagram`
gera um cartão separado **abaixo da galeria**, com o título “Ver mais no Instagram”.
As redes sociais entram como direcionamento e/ou fonte visual com crédito; qualquer imagem
usada no site deve manter fonte, crédito e link de origem.

Se algum artesão não tiver o campo `imagem`, o site mantém automaticamente um fallback
elegante (monograma no card e placeholder tracejado na página). Para trocar uma imagem,
substitua o arquivo em `assets/images/` (sugestão: foto vertical, boa luz, fundo neutro)
e regere as páginas. Revise os direitos das miniaturas de vídeo antes da impressão ampla
(ver `IMAGE_CREDITS.md`).

## Nota curatorial

Os textos foram revistos para leitura fluida: a narrativa biográfica não cita fontes no corpo
do texto, e as referências ficam reunidas ao final de cada página. Algumas entradas trazem
**notas curatoriais** (grafias alternativas, divergências de data ou atribuição que depende da peça exposta).
**Revise todo o conteúdo antes da impressão final.**

## Identidade visual

- Prussian Blue `#173b5a` · Earth Yellow `#cda465` · Linen `#f8f1e7` · branco
- Tipografia: Atkinson Hyperlegible, com fallback para Arial / sans-serif
- Prioridade em legibilidade, contraste alto, fonte generosa e navegação simples no celular.
