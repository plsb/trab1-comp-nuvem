'use strict'

const User = use('App/Models/User')

class UserController {

    async show ({ response, params }) {
        const user = await User.query()
                .where('id', params.id)
                .with('photo')
                .fetch()
        
        return user
    }

    async store ({ request }) {
        const data = request.only(['name', 'nick', 
                            'email', 'password', 'photo_id'])

        const user = await User.create(data)

        return user
    }

    async update ({ params, request, response }) {
        const user = await User.findOrFail(params.id)
    
        const data = request.only([
          'name',
          'password',
          'photo_id',
        ])
    
        user.merge(data)
    
        await user.save()
    
        return user
      }

      async findByNick ({ request }) {
        
        const dados = request.only(['nick'])

        const user = await User.query()
                .where('nick', dados.nick)
                .with('photo')
                .fetch()
    
        return user
      }
}

module.exports = UserController
