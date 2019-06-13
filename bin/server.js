// const { ApolloServer, gql } = require('apollo-server');

// const generateUserModel = ({ user }) => ({
//   getAll: () => { 
//     console.log("user = ")
//     console.log(user)
//     if(!user || !user.roles.includes('admin')) return null;
//     return fetch('http://myurl.com/users');
//   },
//   getById: (id) => { /* fetching/transform logic for a single user */ },
//   getByGroupId: (id) => { /* fetching/transform logic for a group of users */ },
//  });

// const typeDefs = gql`
// type Query {
//   user (id: ID!): User
//   article (id: ID!): Article
//  }
 
//  type Article {
//   author: User
//  }
 
//  type User {
//   id: ID!
//   name: String!
//  }
// `

// const resolvers = {
//   // users: (parent, args, context) => {
//   //   // In this case, we'll pretend there is no data when
//   //   // we're not logged in. Another option would be to
//   //   // throw an error.
//   //   if (!context.user || !context.user.roles.includes('admin')) return null;
   
//   //   return context.models.User.getAll();
//   //  },
//    Query:{
//      article: () => {
//        "aaa"
//      }
//    }
// }

// const server = new ApolloServer({
//  typeDefs,
//  resolvers,
// //  context: ({ req }) => {
// //    // get the user token from the headers
// //    const token = req.headers.authorization || '';
  
// //    // try to retrieve a user with the token
// //    const user = getUser(token);

// //    if (!user) throw new AuthorizationError('you must be logged in'); 
  
// //    // add the user to the context
// //    return { 
// //      user,
// //      models: {
// //       User: generateUserModel({ user }),
// //      }   
// //     };
// //  },
// });

// server.listen().then(({ url }) => {
//  console.log(`🚀 Server ready at ${url}`)
// });

const express = require('express')
const { ApolloServer, gql } = require("apollo-server-express");
// import faker from "faker";
// import times from "lodash.times";
// import random from "lodash.random";
import typeDefs from '../graphql/schema'
import resolvers from "../graphql/resolvers";
import db from '../database/sequelize'
import cors from 'cors'
// const cors = require('cors')

const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
  // context: { db }
  context: ({req}) => {
    const token = req.headers.authentication
    console.log("inside context")

    return { db }
  }
})

const app = express()

app.use(cors())
// app.use(express.static("app/public"));
server.applyMiddleware({ app })

db.sequelize.sync().then(() => {
 
  //create a single row
  // db.models.User.create(
  //   {
  //     email: "email@testtest.com",
  //     username:"testGraphQL2",
  //     password:"password1222"
  //   }
  // )

  //create multiple rows
  // db.models.User.bulkCreate([
  //   { email: "email@testtest.com", username:"testGraphQL2", password:"password1222" },
  //   { email: "email@testtest.com", username:"testGraphQL2", password:"password1222" }
  // ])

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});