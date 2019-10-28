基于[pg](https://www.npmjs.com/package/pg)和orm[sakura-node-3](https://www.npmjs.com/package/sakura-node-3)的事务装饰器

# install

`npm install pg-transaction-decorator`


# ENV

可以配置以下环境变量，直接创建数据库连接

```TypeScript
DB_USER // 用户名
DB_HOST // host
DB_PORT // pg数据库端口
DB_NAME // 数据库名
DB_PASSWORD // 密码

```

或者手动传入配置

```TypeScript

import { TransactionRepository } from "pg-transaction-decorator";

TransactionRepository.setConfig({
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      max: Number(process.env.DB_T_MAX) || 10,
      idleTimeoutMillis: 30000
    });

```

# usage

src/test/index.ts

```TypeScript

import { TransactionRepository, transaction } from "../lib/index";

const env = require("../config/env");

class Test {

  @transaction()
  static async a(conn?: TransactionRepository) {
    const result = await conn.query("select * from users limit 1;");
    console.log(result.rows);

    const d = await conn.query("select * from departmentss limit 1;");
    console.log(d.rows);
  }

  @transaction()
  async b(conn?: TransactionRepository) {
    const result = await conn.query("select * from users limit 1;");
    console.log(result.rows);

    const d = await conn.query("select * from departments limit 1;");
    console.log(d.rows);
  }
}

(
  async () => {
    const t = new Test();
    await t.b();

    await Test.a();
  }
)();


```
