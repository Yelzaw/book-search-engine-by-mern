const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
       me: async (parent, args, context) => {
        if (context.user) {
          const userInfo = User.findOne({ _id: context.user._id })
                .select('-__V -password');
                return userInfo;

        }
        throw new AuthenticationError('You need to be logged in!');
      },
    },
  
    Mutation: {
      addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
      },

      saveBook: async (parent, { bookData }, context) => {
        if (context.user) {
  
          const updatedUserInfo = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookData } },
            { new: true }
          );
  
          return updatedUserInfo;
        }
        throw new AuthenticationError('You need to be logged in!');
      },

      removeBook: async (parent, { thoughtId }, context) => {
        if (context.user) {
          const updatedUserInfo = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: {savedBooks: { bookId }}},
          );
  
          return updatedUserInfo;
        }
        throw new AuthenticationError('You need to be logged in!');
      },
      
    },
  };
  
  module.exports = resolvers;