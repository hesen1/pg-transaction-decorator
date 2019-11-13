import { TransactionRepository } from "./transaction";

/**
 * 事务装饰器
 * @param autoCommit 是否自动commit，释放连接，默认自动commit
 */
export function transaction(autoCommit: boolean = true) {

  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) => {
    const method = descriptor.value;

    descriptor.value = async function() {
      let conn: TransactionRepository = null;
      try {
        conn = await TransactionRepository.getTransaction();

        const result = await method.call(this, ...arguments, conn);

        if (autoCommit) await conn.commit();
        return result;
      } catch (e) {
        if (conn) await conn.rollback();

        throw e;
      } finally {
        if (conn) conn.release();
      }
    };
  };
}
