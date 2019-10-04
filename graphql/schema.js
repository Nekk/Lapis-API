export default `
    type user{
        id: ID!
        firstName: String
        lastName: String
        email: String
        username: String
        password: String
    }
    type expo_token{
        id: ID!
        token: String
        userId: Int
    }
    type Query{
        user(username: String!) : user
        users: [user!]!
        getPushNotiToken(username: String!): String!
    }
    type Mutation{
        loginUser(username: String, password: String): String!
        registerUser(firstName: String, lastName: String, email: String, username: String, password: String): user!
        updateUser(oldUsername: String, firstName: String, lastName: String, email: String, username: String, password: String): [Int!]!
        deleteUser(id: ID!): Int!
        storePushNotiToken(token: String!): expo_token!
    }
`