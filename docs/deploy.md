# デプロイ

## デプロイ方法

1. [gh-pages](https://www.npmjs.com/package/gh-pages)をインストール

```bash
npm install gh-pages --save-dev
```

2. [package.json](/package.json)に以下のコードを追加

```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

3. Git push

4. Github > Settings > [Github Pages](https://github.com/kanbaru-github/book-tracker/settings/pages) > Branch でブランチを**gh-pages**に設定

[![Image from Gyazo](https://i.gyazo.com/83f21b0202db8833f69507f5d4b20e48.png)](https://gyazo.com/83f21b0202db8833f69507f5d4b20e48)

5. ビルド

```bash
npm run build
```

6. デプロイ

```bash
npm run deploy
```
