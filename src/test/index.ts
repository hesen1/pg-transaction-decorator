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
