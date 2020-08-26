'use strict'

const Publication = use("App/Models/Publication")
const User = use('App/Models/User')
const Helpers = use('Helpers')
const File = use('App/Models/File')
const Drive = use('Drive')

class UserController {

    async showMyProfile ({ response, params, view, session }) {
        const selectUser = await User.query()
                .where('id', session.get('id'))
                .with('photo')
                .first()

        const selectPub = await Publication.query()
                .where('user_id', session.get('id'))
                .orderBy('created_at', 'desc')
                .with('photo')
                .fetch()

        const user = selectUser.toJSON()
        const publications = selectPub.toJSON()
        //return publications
        return view.render('my-profile', { user, publications })
    }

    async show ({ response, params, view }) {
        const selectUser = await User.query()
                .where('id', params.id)
                .with('photo')
                .first()
        
        const selectPub = await Publication.query()
                .where('user_id', params.id)
                .orderBy('created_at', 'desc')
                .with('photo')
                .fetch()

        const user = selectUser.toJSON()
        const publications = selectPub.toJSON()
        //return publications
        return view.render('show-profile', { user, publications })
    }

    async edit ({ session, view }) {
      const select = await User.query()
                .where('id', session.get('id'))
                .first()
      const user = select.toJSON()

      return view.render('my-profile-edit', { user })
    }

    async store ({ request, response }) {
        let data = {}
        //return data
        request.multipart.field(async (name, value) => {
          data[name] = value  
          console.log(data);
        });

        let fileSaved 
      
        await request.multipart
          .file('file', {}, async (file) => {
            try{
              const ContentType = file.headers['content-type']
              const ACL = 'public-read'
              const Key = `${(Math.random() * 100).toString(32)}-${file.clientName}`
      
              const url = await Drive.put(Key, file.stream, {
                ContentType,
                ACL
              })
      
              fileSaved = await File.create({
                file: Key,
                name: file.clientName,
                url: url
              })
      
            } catch (err) {
              return response
                .status(err.status)
                .send()
            }
        }).process()

      data['photo_id'] = fileSaved.id
      const user = await User.create(data)

      //return view.render('sign-in')
      response.redirect('/')
    }

    async update ({ params, request, response, session }) {
      
      const data = request.only([
        'name',
        'password',
      ])

      const user = await User.findOrFail(session.get('id'))

      user.merge(data)
      
  
      await user.save() 

      //return view.render('sign-in')
      response.redirect('/users/show-my-profile')
    }

    async findByNick ({ request, view }) {
      
      const dados = request.only(['nick'])

      const selectUsers = await User.query()
              .where('nick', 'like','%'+dados.nick+'%')
              .with('photo')
              .fetch()
      
      const users = selectUsers.toJSON()

      return view.render('list-profiles', { users })
    }
}

module.exports = UserController
