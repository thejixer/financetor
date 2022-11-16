

import User from '../../models/user'
import Tag from '../../models/tag'
import authorizeUser from '../../lib/auth'
import Expense from '../../models/expense'
export default {
  root: {
    Tag: {
      expenseCount: async ({ _id },_, { user }) => {
        
        try {
          
          const expenses = await Expense.findUserExpenses(user._id);

          return expenses.reduce((acc, cur) => cur.tag == _id ? acc + 1 : acc, 0)

        } catch (error) {
          return 0
        }

      }
    }
  },
  Query: {
    getMyTags: async (_, data, {user}) => {
      try {
  
        const thisUser = await authorizeUser(user)

        return await Tag.findUserTags(thisUser._id)

      } catch (error) {
        return []
      }
    }
  },
  Mutation: {
    create_tag: async (_, { data }, { user }) => {
      try {
        
        const thisUser = await authorizeUser(user)

        await Tag.create({
          userId: thisUser._id,
          ...data
        })

        return {
          status: 200,
          msg: 'ok'
        }

      } catch (error) {
        throw error
      }
    },
    edit_tag: async (_, { _id, data }, { user }) => {
      try {
        
        const thisUser = await authorizeUser(user)

        await Tag.findByIdAndUpdate({ _id, userId: thisUser._id, data })
        
        return {
          msg: 'ok',
          status: 200
        }

      } catch (error) {
        throw error
      }
    },
    delete_tag: async (_, { _id }, { user }) => {
      try {
        
        const thisUser = await authorizeUser(user);

        const allExpenses = await Expense.findUserExpenses(thisUser._id);

        const thseExpenses = allExpenses.filter(item => item.tag == _id);

        for (let thisExpense of thseExpenses) {
          await Expense.deleteById({ userId: thisUser._id, _id: thisExpense._id });
        }
        
        await Tag.deleteById({ userId: thisUser._id, _id });
        
        return {
          status: 200,
          msg: 'ok'
        }

      } catch (error) {
        throw error
      }
    }
  }
}