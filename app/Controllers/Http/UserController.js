'use strict'

const Database = use('Database')
const User = use(`App/Models/User`)

class UserController {

  async show ({ params }) {
    const user = await User.findOrFail(params.id)

    await user.loadMany(['addresses', 'roles', 'permissions'])

    return user
  }
 
  async store ({ request }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const addresses = request.input('addresses')

    const trx = await Database.beginTransaction()

    const user = await User.create(data, trx)

    if (addresses) {
      await user.addresses().createMany(addresses, trx)
    }

    await trx.commit()

    if (permissions) {
      await user.permissions().attach(permissions)
    }

    if (roles) {
      await user.roles().attach(roles)
    }
    
    await user.loadMany([
      'addresses', 
      'permissions', 
      'roles'
    ])

    return user
  }
  
  async update ({ request, params }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles',
      'addresses'
    ])
    
    const addresses = request.input('addresses')

    let user = await User.findOrFail(params.id)

    user.merge(data, addresses)

    const trx = await Database.beginTransaction()

    await user.save(trx)
    
    if (addresses) {
      await user.addresses().sync(addresses, trx)
    }

    if (permissions) {
      await user.permissions().sync(permissions, trx)
    }

    if (roles) {
      await user.roles().sync(roles, trx)
    }

    await trx.commit()
    
    await user.loadMany([
      'addresses', 
      'permissions', 
      'roles'
    ])

    return user
  }
}

module.exports = UserController
