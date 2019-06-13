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
      registerUser: (parent, { email, username, password }, { db }, info) =>
        db.models.User.create({
          email: email,
          username: username,
          password: password
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