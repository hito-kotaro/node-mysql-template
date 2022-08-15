# node-mysql-template

Nodejs から Mysql に接続するテンプレート

## install

### db-migrate のインストール(グローバル)

マイグレーションファイル生成用

```
$ npm install -g db-migrate
```

### プロジェクトのパッケージをインストール

```
npm i
```

### database.json の作成

init がないと、DB を新規に作成する時に、DB が無いと怒られる。　　
クレデンシャルが載るので要 ignore

```
{
  "dev": {
    "driver": "mysql",
    "user": <User>,
    "password": <Password>,
    "database": <Database>
  },
  "init": {
    "driver": "mysql",
    "user": <User>,
    "password": <Password>
  }
}

```

### database の作成

**database.json のあるディレクトリで実行**　　
`-e init` とすることで database.json に記述したキーの設定を適用できる

```
db-migrate db:create  <作成するDB名> -e init
```

```
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| node_sample_db     |
| sys                |
+--------------------+
```

### マイグレーションファイルの生成

**database.json のあるディレクトリで実行**  
`-e init` をつけないと、dev のキーの設定が適用される

```
db-migrate create create-table-init
```

実行後は、同じディレクトリないにマイグレーションファイルが生成される。

```
$ ls
migrations/20220815130908-create-table-init.js
```

### マイグレーション(テーブルの作成)

生成されたマイグレーションファイルの、up 関数を以下の通り編集

```
exports.up = function (db, callback) {
  db.createTable(
    'users',
    {
      id: {
        type: 'int',
        unsigned: true,
        primaryKey: true,
        autoIncrement: true,
      },
      name: 'string',
      email: 'string',
      password: 'string',
      token: 'float',
      created_at: 'datetime',
      updated_at: 'datetime',
    },
    callback,
  );

  db.createTable(
    'requests',
    {
      id: {
        type: 'int',
        unsigned: true,
        primaryKey: true,
        autoIncrement: true,
      },
      users_id: {
        type: 'int',
        unsigned: true,
        foreignKey: {
          name: 'requests_user_id_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      created_at: 'datetime',
      updated_at: 'datetime',
    },
    callback,
  );
};
```

同じく、down 関数に以下の記述を追加

```
exports.down = function(db, callback) {
  db.dropTable('users',callback);
  db.dropTable('requests',callback);
};
```

### マイグレーションの実行

**database.json のあるディレクトリで** 以下のコマンドを実行

```
$ db-migrate up
```

変更を戻す場合

```
$ db-migrate down
```
