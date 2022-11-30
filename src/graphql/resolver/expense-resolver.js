import Expense from '../../models/expense'
import authorizeUser from '../../lib/auth'

import Tag from '../../models/tag'

export default {
  root: {
    Me: {
      myExpenses: async (_, data, { user }) => {
        
        try {
          const thisUser = await authorizeUser(user)
          return await Expense.findUserExpenses(thisUser._id) 

        } catch (error) {
          return []
        }
      },
      myTags: async (_, data, { user }) => {

        try {
  
          const thisUser = await authorizeUser(user)

          return await Tag.findUserTags(thisUser._id)

        } catch (error) {
          return []
        }
      }
    },
    Expense: {
      tag: async ({ tag }, _, { user }) => {
        
        try {
          const thisUser = await authorizeUser(user)

          const userTags = await Tag.findUserTags(thisUser._id)

          return userTags.find(item => item._id == tag)

        } catch (error) {
          throw error
        }
      }
    }
  },
  Query: {
    getMyExpenses: async (_, data, { user }) => {
      try {
        const thisUser = await authorizeUser(user)
        return Expense.findUserExpenses(thisUser._id)
      } catch (error) {
        return []
      }
    }
  },
  Mutation: {
    create_expense: async (_, { data }, { user }) => {
      
      try {
        
        const thisUser = await authorizeUser(user)
        const userTags = await Tag.findUserTags(thisUser._id)

        const isTagThere = userTags.some(item => item._id == data.tag)

        if (!isTagThere) throw new Error('invalid tag')

        await Expense.create({ userId: thisUser._id, ...data })
        
        return {
          status: 200,
          msg: 'ok'
        }

      } catch (error) {
        throw error
      }
    },
    delete_expense: async (_, { _id }, { user }) => {
      try {
        
        const thisUser = await authorizeUser(user)

        await Expense.deleteById({ userId: thisUser._id, _id })
        
        return {
          msg: 'ok',
          status: 200
        }

      } catch (error) {
        throw error
      }
    },
    edit_expense: async (_, { _id, data }, { user }) => {
      
      try {
        
        const thisUser = await authorizeUser(user)

        const userTags = await Tag.findUserTags(thisUser._id)

        const isTagThere = userTags.some(item => item._id == data.tag)

        if (!isTagThere) throw new Error('invalid tag')

        await Expense.findByIdAndUpdate({ _id, data, userId: thisUser._id })
        
        return {
          msg: 'ok',
          status: 200
        }

      } catch (error) {
        throw error
      }

    }
  }
}