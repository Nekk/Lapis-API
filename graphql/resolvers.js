import Expo from 'expo-server-sdk'
// import { expo_push_token } from '../database/constant'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const saltRounds = 10
const byteSize = 45
let expo_push_token;

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
  // user:{
  //     terminal: (parent, args, context, info) => parent.getTerminal()
  // },
  // terminal:{
  //     users: (parent, args, context, info) => parent.getUsers()
  // }
  Query:{
      users: (parent,args, {db}, info) => db.models.user.findAll(),
      user: (parent, { username }, { db }, info) => db.models.user.findOne({ where:{ username } }),
      getUserId:(parent, { username },{ db }, info) => {
        return db.models.user.findOne({
          raw: true,
          attributes: ['id'],
          where: { username }
        }).then(res => {
          return res.id
        })
      },
      getPushNotiToken: (parent, { userId },{ db }, info) => {
        // console.log(userId)
        // console.log(typeof userId)
        
        return db.models.expo_token.findOne({
          raw: true,
          attributes: [ 'token' ],
          where: { userId }
        })
        .then(res => {
          // console.log(res)
          // return the token
          return res.token
        })
      }
    },
  Mutation: {
      loginUser: async (parent, {username, password}, { db }, info) => {
        const condition = {username}
        const findUser = await db.models.user.findOne({
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

        return db.models.user.create({
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword
        })
      },
      updateUser: async (parent, { oldUsername, firstName, lastName, email, username, password }, { db }, info) => {
        
        const findUserID = await db.models.user.findOne({
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

          return await db.models.user.update({
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
        db.models.user.destroy({
          where: {
            id
          }
      }),
      storePushNotiToken: (parent, { token, userId }, { db }, info) => {
        return db.models.expo_token.create({ 
          token,
          userId
        })
      }, 
  }
}