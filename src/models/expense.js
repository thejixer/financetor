import { writeFileSync, existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync } from "fs";
import path from "path";

import { UID } from "../lib";

import Tag from "./tag";

// console.log(unlink)

const userDirectory = path.join(process.cwd(), "/src/db/users");

class ExpenseSchema {
  constructor() {}

  async create({ amount, tag, geo,address, userId, date }) {
    try {
      if (
        !amount ||
        !tag ||
        !geo ||
        !geo.lat ||
        !geo.lon ||
        !userId
      )
        throw new Error("bad input");
      const data = { amount, tag, geo,address, date, _id: UID() };

      const userTags = await Tag.findUserTags(userId);

      const cache = {};

      userTags.forEach((item) => (cache[item._id] = item));

      const dest = `${userDirectory}/${userId}/expenses`;

      if (!existsSync(dest)) {
        mkdirSync(dest);
      }

      writeFileSync(`${dest}/${data._id}.txt`, JSON.stringify(data), "utf8");

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findUserExpenses(_id) {
    try {
      if (!existsSync(`${userDirectory}/${_id}/expenses`)) return [];

      const theseExpenses = readdirSync(`${userDirectory}/${_id}/expenses`).map(item => {
        return readFileSync(path.join(`${userDirectory}/${_id}/expenses/`, item), {
          encoding: "utf8",
        })
      })

      // const x = readdirSync(`${userDirectory}/${_id}/expenses`).reduce(
      //   (acc, cur, i) =>
      //     acc +
      //     `${i == 0 ? "" : ","}` +
      //     readFileSync(path.join(`${userDirectory}/${_id}/expenses`, `/${cur}`), {
      //       encoding: "utf8",
      //     }),
      //   "["
      // );
      // const y = `${x}]`;

      // const result = JSON.parse(y);

      return theseExpenses;
    } catch (error) {
      return []
      // throw error;
    }
  }

  async findById({ _id, userId }) {
    try {
      const x = readFileSync(path.join(userDirectory, `/${userId}/expenses/${_id}.txt`), {
        encoding: "utf8",
      });

      return JSON.parse(x);
    } catch (error) {
      throw error;
    }
  }

  async deleteById({ _id, userId }) {
    
    try {

      unlinkSync(path.join(userDirectory, `/${userId}/expenses/${_id}.txt`))

      return true
      
    } catch (error) {
      console.log(error)
      throw new Error('no')
    }
  }

  async findByIdAndUpdate({ _id, data, userId }) {
    
    try {
      
      const thisExpense = await this.findById(_id)

      Object.entries(data).forEach(([key, value]) => thisExpense[key] = value)

      writeFileSync(`${userDirectory}/${userId}/expenses/${_id}.txt`, JSON.stringify(thisExpense), "utf8")

      return true

    } catch (error) {
      throw error
    }
  }

}

const Expense = new ExpenseSchema();

export default Expense;
