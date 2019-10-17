# Rails+Vue+TypeScript Skeleton

## コンセプト
- Rails 6.0.0
- Vue.js 2.6.10
- TypeScript 3.6.4
- No CoffeeScript
- No Sprockets
- No Webpacker
- With Webpack
- With MySQL
- With Capistrano
- With Vuex
- With Vue Router
- With Vue I18n
- With EventHub
- With Bulma *
- With Font Awesome *
- With Docker（開発用） *

`*` 印つきの項目は、アンインストール方法を後述します。

## 想定開発環境

ある程度差異があっても動くとは思います。

### Docker を使う場合

- macOS 10.14.6
- Docker Desktop for Mac 2.1.0.3

### Docker を使わない場合

- macOS 10.14.6
- RVM 1.29.9
  - Ruby 2.6.5
- Node.js 10.16.3
- MySQL 5.7.27
- Yarn 1.19.1

## つかいかた

スケルトン自体も随時更新していくつもりですので、このリポジトリから fork して作ることをおすすめします。

### 初期設定

- 上記「動作環境」のソフトウェアをあらかじめインストールしておきます。Docker を使う場合と使わない場合で必要となる環境が異なります。
- `rails6-vue2-ts3-skeleton` および `Rails6Vue2Ts3Skeleton` という文字列を全文検索し、自分のアプリケーション名に置換します。
- 必要があれば `config/storage.yml` `config/cable.yml` を編集して Active Storage と Action Cable の設定を行います。

### 環境構築と起動（Docker を使う場合）

- Docker コンテナを構成します。
  - もし今後ターミナル上でエディタを開く際に emacs ではなく vim を使いたい場合は、 `Dockerfile.dev` を開き、 `emacs` と書いてある箇所を `vim` に書き換えてから下記コマンドを実行してください。

```
$ docker-compose build
```

- データベースのセットアップとパッケージのインストールを行います。

```
$ docker-compose run --rm rails rails db:setup
$ docker-compose run --rm rails yarn install
```

- 暗号化ファイルの初期化を行います。
  - 下記のコマンドを実行するとターミナル上でエディタが起動しますので、何も編集せずに保存してください。
  - emacs ではなく vim を使いたい場合は、 `.env.dev` ファイル内の `EDITOR=emacs` を `EDITOR=vim` に書き換えてから実行してください。

```
$ docker-compose run --rm rails rails credentials:edit
```

- これで環境構築は終了ですので、下記のコマンドで起動します。

```
$ docker-compose up
```

- `binding.pry` を使いたい場合は、もうひとつターミナルを開き、まず rails コンテナのコンテナ名を調べます。

```
$ docker ps
```

- その後、そのコンテナ名を指定して attach します。

```
$ docker attach rails-vue-ts-skeleton_rails_1
```


### 環境構築と起動（Docker を使わない場合）

- `config/database.yml` を編集して `development` データベースの設定を行います。
- `EDITOR=emacs rails credentials:edit` を実行して、 `master.key` と `credentials.yml.enc` を生成し、保存します。
  - エディタに vim を使いたい場合は、 `EDITOR=emacs` の代わりに `EDITOR=vim` を指定してください。
- 最後に、パッケージのインストールとデータベースのセットアップのため、ターミナルを開いて、このリポジトリのディレクトリへ移動し、下記のコマンドを実行します。

```
$ bundle
$ yarn
$ rake db:setup
```

2つターミナルを開き、いずれもこのリポジトリのディレクトリまで移動します。1つめのターミナルで下記のコマンドを実行します。

```
$ rails s
```

2つめのターミナルで、下記のコマンドを実行します。

```
$ yarn webpack-dev-server
```

2つのターミナルを開いた状態で、`http://localhost:3000` へアクセスします。

### デプロイ

デプロイ設定は [別ファイル](/doc/DEPLOY.md) に分けましたが、デプロイ先の環境や方針に大きく左右されますので、あくまでも参考としてご覧ください。

## カスタマイズ

### MySQL + InnoDB + utf8mb4 対応のためのスクリプトの削除
本スケルトンには、MySQL + InnoDB 環境下で utf8mb4 に対応するためのスクリプトが含まれていますが、もし MySQL + InnoDB 以外の環境を使う場合には邪魔なので、 `config/initializers/ar_innodb_row_format.rb` を削除します。

### Bulma の削除
- Yarn で Bulma を削除します。

```
$ yarn remove bulma
```

- `frontend/styles/main/vendor/_index.sass` を開き、下記の行を削除します。

```
@import '~bulma/css/bulma.css'
```

### Font Awesome の削除
- Yarn で Font Awesome を削除します。

```
$ yarn remove @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/vue-fontawesome
```

- `frontend/scripts/config/icons.ts` を削除します。
- `frontend/scripts/entries/app.ts` を開き、下記の行を削除します。

```
import 'scripts/config/icons'
```

### Docker 用設定ファイルの削除
- `docker-compose.yml` `Dockerfile.dev` `.env.dev` を削除します。


## ToDo
- [ ] production 環境での最適化
