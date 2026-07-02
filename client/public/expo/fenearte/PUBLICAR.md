# Checklist de publicação — Exposição “Mãos que contam histórias”

## 1. Onde publicar

Endereço sugerido para manter os QR codes já gerados:

```text
https://metisacademia.com.br/expo/fenearte/
```

A estrutura publicada deve ficar assim:

```text
/expo/fenearte/index.html
/expo/fenearte/artesaos/manoel-eudocio.html
/expo/fenearte/artesaos/...
/expo/fenearte/assets/style.css
/expo/fenearte/assets/images/...
```

## 2. Pacote recomendado para hospedagem

Use o arquivo:

```text
exposicao-artesaos-fenearte-site-publicavel.zip
```

Ele contém somente o site estático necessário para hospedagem: `index.html`, `artesaos/`, `assets/`, `README.md`, `IMAGE_CREDITS.md`.

## 3. Depois de subir

1. Abrir no navegador:
   - `https://metisacademia.com.br/expo/fenearte/`
   - `https://metisacademia.com.br/expo/fenearte/artesaos/manoel-eudocio.html`
2. Confirmar que as imagens carregam no celular.
3. Confirmar que os links “Ver fonte” abrem.
4. Testar pelo menos 2 QR codes físicos com celular.
5. Se a URL final for diferente da sugerida, regenerar os QR codes e plaquinhas:

```bash
python3 scripts/generate_qr.py --base-url https://ENDERECO-REAL/
```

## 4. Direitos de imagem

As imagens foram baixadas localmente para enriquecer o site e estão creditadas em cada página e em `IMAGE_CREDITS.md`.

- A foto de Mestre Espedito Seleiro vem do Wikimedia Commons com licença CC BY-SA 2.0.
- As demais imagens são miniaturas públicas de vídeos do YouTube usados como fonte visual/referencial.
- Antes de uso comercial, anúncio amplo ou impressão em escala, recomenda-se conferir permissões/licenças das miniaturas de vídeo.

## 5. Revisão curatorial antes da impressão

- Conferir grafias e atribuições.
- Benedito Santeiro: a identificação foi inferida a partir da fonte sobre Mestre Rosalvo; confirmar se corresponde à peça exposta.
- Expedito/Espedito: a grafia consagrada nas fontes é Mestre Espedito Seleiro.
