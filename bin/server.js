import typeDefs from '../graphql/schema'
import resolvers from "../graphql/resolvers";
import db from '../database/sequelize'
import cors from 'cors'
// const cors = require('cors')

const express = require('express')
const { ApolloServer, gql } = require("apollo-server-express");

const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
  // context: { db }
  context: ({req}) => {
    const token = req.headers
    // console.log("token = ")
    // console.log(token)
    // console.log("inside context")

    return { db }
  }
})

const app = express()

app.use(cors())
// app.use(express.static("app/public"));
server.applyMiddleware({ app })

db.sequelize.sync().then(() => {
 
  //create a single row
  // db.models.user.create(
  //   {
  //     email: "email@testtest.com",
  //     username:"testGraphQL2",
  //     password:"password1222"
  //   }
  // )

  //create multiple rows
  // db.models.user.bulkCreate([
  //   { email: "email@testtest.com", username:"testGraphQL2", password:"password1222" },
  //   { email: "email@testtest.com", username:"testGraphQL2", password:"password1222" }
  // ])

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});