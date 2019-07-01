const bcrypt = require('bcrypt')
const saltRounds = 10

export default {
  // User:{
  //     terminal: (parent, args, context, info) => parent.getTerminal()
  // },
  // Terminal:{
  //     users: (parent, args, context, info) => parent.getUsers()
  // }
  Query:{
      users: (parent,args, {db}, info) => db.models.User.findAll(),
      user: (parent, { id }, { db }, info) => db.models.User.findById(id)
  },
  Mutation: {
      loginUser: async (parent, {username, password}, { db }, info) => {
        const condition = {username}

        const findUser = await db.models.User.findOne({
          raw: true,
          where: condition
        })

        if(findUser){
          return await bcrypt.compare(password, findUser.password)
          .then(res => {
            return res
          })
        }
        return false // can't find the specified user
      }
      ,
      registerUser: (parent, { email, username, password }, { db }, info) =>
        bcrypt.hash(password, saltRounds)
        .then( hash => {
          return db.models.User.create({
            email: email,
            username: username,
            password: hash
          })
        }),
      updateUser: (parent, { id, username }, { db }, info) =>
        db.models.User.update({
          username: username
        },
        {
          where: {
            id: id
          }
        }),
      deleteUser: (parent, {id}, { db }, info) =>
        db.models.User.destroy({
          where: {
            id: id
          }
        })
  }
}