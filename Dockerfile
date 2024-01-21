# puppeteerの公式Dockerイメージを使用
FROM --platform=linux/arm64 ghcr.io/puppeteer/puppeteer:21.7.0
LABEL author="tocomi"

# アプリケーションディレクトリを作成
USER pptruser
WORKDIR /home/pptruser/app

# パッケージ依存関係のコピーとインストール
COPY --chown=pptruser:pptruser package.json ./
COPY --chown=pptruser:pptruser yarn.lock ./
RUN yarn

# アプリケーションのソースをバンドル
COPY --chown=pptruser:pptruser . .

# TypeScriptをコンパイル
RUN npx tsc

# Cloud Runで公開するポート番号を指定
EXPOSE 8080

# Node.jsアプリケーションを起動するコマンド
CMD [ "node", "dist/index.js" ]
