export default `
    type User{
        id: ID!
        firstName: String
        lastName: String
        email: String
        username: String
        password: String
    }
    type Query{
        user(username: String!) : User
        users: [User!]!
    }
    type Mutation{
        loginUser(username: String, password: String): String!
        registerUser(firstName: String, lastName: String, email: String, username: String, password: String): User!
        updateUser(oldUsername: String, firstName: String, lastName: String, email: String, username: String, password: String): [Int!]!
        deleteUser(id: ID!): Int!
    }
`