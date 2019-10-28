import { Pool, Client, QueryResult, PoolConfig } from "pg";
import { SelectQuery, UpdateQuery, DeleteQuery, InsertQuery, DBClient } from "sakura-node-3";
import { isString } from "util";

/**
 * 获取事务
 */
export class TransactionRepository {

  private static pool: Pool;
  private client: Client;
  private static config: PoolConfig;

  private constructor(client: Client) {
    this.client = client;
  }

  /**
   * 配置数据库
   * @param config 数据库连接配置
   */
  static setConfig(config?: PoolConfig) {
    TransactionRepository.config = config || {
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      max: Number(process.env.DB_T_MAX) || 10,
      idleTimeoutMillis: 30000
    };
  }

  /**
   * 获取事务实例
   * @param config 数据库连接配置
   */
  static async getTransaction(config?: PoolConfig) {
    if (!TransactionRepository.pool) {
      if (!TransactionRepository.config) TransactionRepository.setConfig(config);
      TransactionRepository.pool = new Pool(config || TransactionRepository.config);
    }
    const t = new TransactionRepository(await TransactionRepository.pool.connect());
    await t.query("BEGIN;");
    return t;
  }

  /**
   * 查询，（尽量传入 string 类型的sql语句，减少事务开启时间）
   * @param sqls 请为每句sql 加上 ; 号
   */
  async query(...sqls: (string | SelectQuery | UpdateQuery | DeleteQuery | InsertQuery)[]): Promise<QueryResult> {

    const list: string[] = [];

    for (const item of sqls) {
      if (isString(item)) {
        list.push(item);
      } else {
        const sql = DBClient.getClient().queryToString(item);
        list.push(sql);
      }
    }

    const resulst = await this.client.query(list.join(""));
    return resulst;
  }

  /**
   * 正确提交事务
   */
  async commit(...sqls: (string | SelectQuery | UpdateQuery | DeleteQuery | InsertQuery)[]) {
    if (sqls.length) {
      sqls.push("COMMIT;");
      return this.query(...sqls);
    }
    this.client.query("COMMIT;");
  }

  /**
   * 回滚事务
   */
  async rollback() {
    this.client.query("ROLLBACK;");
  }

  /**
   * 释放连接
   * @param needDestory 是否需要销毁此连接，默认不销毁,需要销毁传 true
   */
  release(needDestory: any = false) {
    this.client.release(needDestory);
    this.client = null;
  }
}
