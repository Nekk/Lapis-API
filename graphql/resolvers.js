import Expo from 'expo-server-sdk'

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

const hashPassword = async (plainPassword) => {
  const encryptedPassword = await bcrypt.hash(plainPassword, saltRounds).then( hash => {
    return hash
  })
  return encryptedPassword
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
      user: (parent, { username }, { db }, info) => db.models.User.findOne({ where:{ username } }),
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
          return accessToken
        }
        return '' // can't find the specified user
      },
      registerUser: async (parent, { firstName, lastName, email, username, password }, { db }, info) => {
        const hashedPassword = await hashPassword(password)

        return db.models.User.create({
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword
        })
      },
      updateUser: async (parent, { oldUsername, firstName, lastName, email, username, password }, { db }, info) => {
        
        const findUserID = await db.models.User.findOne({
          raw: true,
          attributes:[
            'id'
          ],
          where:{
            username : oldUsername
          }
        })
        if(findUserID) {
          const id = findUserID.id
          const hashedPassword = await hashPassword(password)

          return await db.models.User.update({
            firstName,
            lastName,
            email,
            username,
            password : hashedPassword
          },
          {
            where: {
              id
            }
          })
        }
        return [0] // can't find the user to update
      },
      deleteUser: (parent, {id}, { db }, info) =>
        db.models.User.destroy({
          where: {
            id
          }
        })
  }
}