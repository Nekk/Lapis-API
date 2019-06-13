export default `
    type User{
        id: ID!
        email: String
        username: String
        password: String
    }
    type Query{
        user(id: ID!) : User
        users: [User!]!
    }
    type Mutation{
        registerUser(email: String, username: String, password: String): User!
        updateUser(id: ID!, username: String): [Int!]!
        deleteUser(id: ID!): Int!
    }
`