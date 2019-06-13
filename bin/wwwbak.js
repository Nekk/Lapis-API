// #!/usr/bin/env node

// /**
//  * Module dependencies.
//  */

// var app = require('../app');
// var debug = require('debug')('lapis-api:server');
// var http = require('http');

// /**
//  * Get port from environment and store in Express.
//  */

// var port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);

// /**
//  * Create HTTP server.
//  */

// var server = http.createServer(app);

// /**
//  * Listen on provided port, on all network interfaces.
//  */

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);

// /**
//  * Normalize a port into a number, string, or false.
//  */

// function normalizePort(val) {
//   var port = parseInt(val, 10);

//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }

//   if (port >= 0) {
//     // port number
//     return port;
//   }

//   return false;
// }

// /**
//  * Event listener for HTTP server "error" event.
//  */

// function onError(error) {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   var bind = typeof port === 'string'
//     ? 'Pipe ' + port
//     : 'Port ' + port;

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(bind + ' requires elevated privileges');
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(bind + ' is already in use');
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }

// /**
//  * Event listener for HTTP server "listening" event.
//  */

// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr === 'string'
//     ? 'pipe ' + addr
//     : 'port ' + addr.port;
//   debug('Listening on ' + bind);
// }

const { ApolloServer } = require('apollo-server-express')
const { buildSchema } = require('graphql');
const { gql } = require('apollo-server');
const express = require('express')
const graphqlHTTP = require('express-graphql');
const cors = require('cors')

const books = require('../model/books').books
const User = require('../model/User').User

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.


// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
var fakeDatabase = {}

const schema = buildSchema(`
input UserInput {
  username: String
  password: String
}

type User {
  id: ID!
  username: String
  password: String
  email: String
}

type Query {
  getUser(id: ID!): User
}

type Mutation {
  createUser(input: UserInput): User
  updateUser(id: ID!, input: UserInput): User
}
`);

const resolvers = {
  // Query: {
  //   books: () => books,
  // }
};

const root = {
  createUser: function({input}) {
    console.log(input)
    var id = require('crypto').randomBytes(10).toString('hex');
    fakeDatabase[id] = input
    return new User(id, input)
  },
  getUser: function({id}){
    if (!fakeDatabase[id]) {
      throw new Error('no user exists with id ' + id);
    }
    return new User(id, fakeDatabase[id]);
  },
  updateUser: ({id, input}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no user exists with id ' + id);
    }
    fakeDatabase[id] = input
    return new User(id,fakeDatabase[id])
  }
}

loggingMiddleware = (req, res, next) => {
  console.log()
}

const app = express()

app.use(cors())
// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.

app.use('/graphql',graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql : true
}))

app.use(loggingMiddleware)

const server = new ApolloServer({ typeDefs, resolvers });
// server.applyMiddleware({app});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.

// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });
app.listen(4000, ()=> {
  console.log(`app is working on port 4000 ${server.graphqlPath}`);
});