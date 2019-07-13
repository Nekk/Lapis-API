const bcrypt = require('bcrypt')
const crypto = require('crypto')
const saltRounds = 10
const tokenSize = 45

const requestToken = (isUserExist) => {
  if(isUserExist){
    return crypto.randomBytes(tokenSize).toString('hex')
  }
  return null
}

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
          let isUserExist = await bcrypt.compare(password, findUser.password)
          .then(res => {
            return res
          })
          const accessToken = requestToken(isUserExist)
          
          return accessToken
        }
        return 'safsa' // can't find the specified user
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
            id
          }
        }),
      deleteUser: (parent, {id}, { db }, info) =>
        db.models.User.destroy({
          where: {
            id
          }
        })
  }
}