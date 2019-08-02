const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const saltRounds = 10
const byteSize = 45

const requestToken = (payload) => {
    // return crypto.randomBytes(tokenSize).toString('hex')
    const secret = crypto.randomBytes(byteSize).toString('hex')
    const signOptions = {
      // issuer: "LAPIS",
      // subject: "oneforall@lapis.com",
      // audience: 'http://www.lapis.com',
      expiresIn: '1h',
      // algorithm: "RS256"
    }
    const token = jwt.sign(payload, secret, signOptions)
    return token
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
          let accessToken = "Generate Token Error"; // password doesn't match
          let isUserExist = await bcrypt.compare(password, findUser.password)
          .then(res => {
            return res
          })
          const payload = {
            username
          }
          
          if(isUserExist) accessToken = requestToken(payload)
          // console.log("here")
          // console.log(accessToken)
          return accessToken
        }
        return '' // can't find the specified user
      },
      registerUser: (parent, { firstName, lastName, email, username, password }, { db }, info) =>
        bcrypt.hash(password, saltRounds)
        .then( hash => {
          return db.models.User.create({
            first_name: firstName,
            last_name: lastName,
            email,
            username,
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