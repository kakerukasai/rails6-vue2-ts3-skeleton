# デプロイ方法
このデプロイ手順はあくまでも一例です。随時、自分の環境に読みかえて使ってください。また、このファイルは自分のプロジェクトに合わせて随時書きかえてください。

ここで説明するデプロイ方法が想定する環境は、下記の通りです。

いちおう、下記のコマンドは CentOS 7 環境でのデプロイを想定しています。

## サーバのセットアップ
- MySQL, Nginx, Git および必要となるライブラリをインストールします。

```
$ sudo yum install -y mysql nginx git patch autoconf automake bison gcc-c++ libffi-devel libtool patch readline-devel sqlite-devel zlib-devel glibc-headers glibc-devel libyaml-devel openssl-devel mysql-devel ImageMagick
```

- Nginx と MySQL の自動起動を設定します。

```
$ sudo systemctl enable nginx
$ sudo systemctl enable mysqld.service
```

- MySQL の設定ファイル `my.cnf` を編集します。InnoDB 上で utf8mb4 を使えるようにするため、 `[mysqld]` セクション内に行を追加します。

```
$ sudo emacs /etc/my.cnf
```

```
innodb_file_format=Barracuda
innodb_file_per_table=1
innodb_large_prefix
character-set-server=utf8mb4
```

- このアプリケーション用のデータベースを作成します。
    - このアプリケーション専用のデータベースユーザを作成し、パスワードと、作ったデータベースへの権限を設定します。

- Nginx の設定を追加し、このアプリケーション用の VirtualHost を設定します。
    - 必要があれば SSL の設定も行います。
    - ドメインの設定が必要であれば、レジストラの管理画面等から名前解決の設定を行っておきます。

```
$ sudo emacs /etc/nginx/conf.d/virtual_com_example.conf
```

- アプリケーション実行用のユーザを作成します。ここでは `webapp` というユーザ名とします。

```
$ useradd webapp
$ passwd webapp
```

- このアプリケーション用のデプロイ先ディレクトリを作ります。ディレクトリは Nginx の設定で指定した場所に作ります。ここではデプロイ先は `/var/www/sites/com_example` と想定しますが、`com_example` ディレクトリは Capistrano が自動生成しますので、それができるように親ディレクトリを作成し、アクセス権を設定しておきます。

```
$ sudo mkdir /var/www
$ sudo mkdir /var/www/sites
$ sudo chown webapp. /var/www/sites
```

- 先程作ったアプリケーション実行用ユーザとしてログインし、ホームディレクトリに移動します。

```
$ sudo su - webapp
$ cd
```

- RVM をインストールし、それを使って Ruby をインストールします。
    - このアプリケーション用の gemset を作成し、その gemset 内に bundler もインストールしておきます。

```
$ gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
$ \curl -sSL https://get.rvm.io | bash -s stable
$ source .profile
$ rvm install ruby-2.6.0
$ rvm ruby-2.6.0 do rvm gemset create rails6-vue2-ts3-skeleton
$ source ~/.rvm/scripts/rvm
$ rvm use ruby-2.6.0
$ rvm gemset use rails6-vue2-ts3-skeleton
$ gem install bundler -v '1.17.3'
```

- `master.key` の内容を、サーバ上の環境変数として設定します。

```
$ echo 'export RAILS_MASTER_KEY={ここにmaster.keyの内容を書きます}' >> ~/.bashrc
```

- JS 環境をインストールします。ここでは Nodebrew をインストールし、それを使って node をインストールします。

```
$ wget git.io/nodebrew
$ perl nodebrew setup
$ echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/.bashrc
$ nodebrew install-binary v10.16.3
$ nodebrew use v10.16.3
```

- デプロイ用の鍵を作成します。作った鍵を `cat` コマンドで表示し、それを github に登録します。

```
$ cd ~/.ssh
$ ssh-keygen -t rsa
$ cat id_rsa.pub
```

- 最後に Nginx と MySQL を再起動します。

```
$ sudo systemctl restart nginx.service
$ sudo systemctl restart mysqld.service
```

## デプロイ設定
ローカル環境上でデプロイ設定を整えます。

Capistrano によるデプロイ設定は `config/deploy.rb` および `config/deploy/` 以下のファイルにまとまっていますので、これを書きかえて設定します。

- `~/.ssh/config` に、デプロイ先サーバの SSH 設定を追加します。
- `config/deploy.rb` を開き、下記の点を書きかえます。
    - `set :application, "rails6-vue2-ts3-skeleton"` の行の `rails6-vue2-ts3-skeleton` を、自分のアプリケーション名に変更
    - `set :repo_url, "git@github.com:kakerukasai/rails6-vue2-ts3-skeleton.git"` の行の `git@github.com:kakerukasai/rails6-vue2-ts3-skeleton.git"` を、自分のアプリケーションのリポジトリ URL に変更
- `config/deploy/production.rb` を開き、下記の点を書きかえます。
    - `role :app, %w(com_example_webapp)` `role :web, %w(com_example_webapp)` `role :db,  %w(com_example_webapp)` の3行の `com_example_webapp` を、先程設定した SSH 設定に基づき、デプロイ先の SSH 接続名に書きかえます。
    - `set :user, 'webapp'` の行の `webapp` を、デプロイ先サーバにおける、このアプリケーション実行ユーザ名に書きかえます。
    - `set :deploy_to, '/var/www/sites/com_example'` の行の `/var/www/sites/com_example` を、デプロイ先サーバ内のデプロイ先ディレクトリ名に書きかえます。
- `config/database.yml` を開き、`production` 環境の設定を書きかえます。先程設定したデータベース名、データベースユーザ名を設定します。
    - `EDITOR=emacs rails credentials:edit` を実行し、`production` 環境用のデータベースユーザパスワードを設定します。
- 必要に応じて `config/environments/production.rb` `config/storage.yml` `config/cable.yml` などを書きかえます。

書きかえが終わったら、成果を `master` ブランチへ commit / push します。

## 実行
- ローカル環境上のターミナルで、このアプリケーションのディレクトリに移動して下記のコマンドを実行します。

```
$ cap production deploy
```
