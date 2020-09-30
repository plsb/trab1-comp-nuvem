'use strict'

const Publication = use("App/Models/Publication")
const User = use('App/Models/User')
const File = use('App/Models/File')
const Helpers = use('Helpers')
//const Followers = use('App/Models/Followers');

const {Storage} = use('@google-cloud/storage')
const path = use('path');

const gc = new Storage({
  keyFilename: path.join(__dirname, "../../../chave.json"),
  projectId: 'trab-comp-nuvem'
});

const trabNuvemBucket = gc.bucket('trab-nuvem')
const {Datastore} = require('@google-cloud/datastore');


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

    async show ({ response, params, view, session }) {
        const selectUser = await User.query()
                .where('id', params.id)
                .with('photo')
                .first()

        const selectPub = await Publication.query()
                .where('user_id', params.id)
                .orderBy('created_at', 'desc')
                .with('photo')
                .fetch()

      const datastore = new Datastore({
        keyFilename: path.join(__dirname, "../../../chave.json"),
        projectId: 'trab-comp-nuvem'
      });
      const query = datastore.createQuery('followers').order('user_id');
      const [followers] = await datastore.runQuery(query);
      console.log('followers:');
      let followSpec = 0
      if(selectUser.id != session.get('id').toString()) {
        for (const follower of followers) {
          if (follower.user_id == session.get('id').toString() &&
            follower.user_followed === params.id.toString()) {
            followSpec = 1
          }

        }
      } else {
        followSpec = -1
      }

        /*const followAll = await Followers.scan().exec();
        const followSpec = followAll.filter(function (a) {
            return a.user_id === session.get('id').toString()
                && a.user_followed === params.id.toString();
        });*/

        const user = selectUser.toJSON()
        const publications = selectPub.toJSON()
        console.log('Qtd Follow', followSpec)
        return view.render('show-profile', { user, publications, followSpec })
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

        request.multipart.field(async (name, value) => {
          data[name] = value
        });

        let fileSaved
        let profilePic
        await request.multipart
          .file('image', {}, async (file) => {
            if(file){
              try{
                const profilePic = file

                //console.log('Prop', profilePic)
                await profilePic.move(Helpers.tmpPath('uploads'), {
                  name: profilePic.clientName,
                  overwrite: true
                })

                const imageGPC = await trabNuvemBucket.upload("./tmp/uploads/"
                  +profilePic.clientName, {
                  // Support for HTTP requests made with `Accept-Encoding: gzip`
                  gzip: true,
                  // By setting the option `destination`, you can change the name of the
                  // object you are uploading to a bucket.
                  metadata: {
                    // Enable long-lived HTTP caching headers
                    // Use only if the contents of the file will never change
                    // (If the contents will change, use cacheControl: 'no-cache')
                    cacheControl: 'public, max-age=31536000',
                  },
                }).catch(console.error)
                console.log(imageGPC)

                fileSaved = await File.create({
                  file: file.clientName,
                  name: file.clientName,
                  url: imageGPC[0].metadata.mediaLink
                })

              } catch (err) {
                return response
                  .status(err.status)
                  .send()
              }
            }
        }).process()
      data['photo_id'] = fileSaved.id
      const user = await User.create(data)

      response.redirect('/')
    }

    async update ({ params, request, response, session }) {

      let data = request.only([
        'name',
        'password',
      ])

      let fileSaved = null;

      if(request.file('file')){
        const profilePic = file

        //console.log('Prop', profilePic)
        await profilePic.move(Helpers.tmpPath('uploads'), {
          name: profilePic.clientName,
          overwrite: true
        })

        const imageGPC = await trabNuvemBucket.upload("./tmp/uploads/"
          +profilePic.clientName, {
          // Support for HTTP requests made with `Accept-Encoding: gzip`
          gzip: true,
          // By setting the option `destination`, you can change the name of the
          // object you are uploading to a bucket.
          metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
          },
        }).catch(console.error)
        console.log(imageGPC)

        fileSaved = await File.create({
          file: file.clientName,
          name: file.clientName,
          url: imageGPC[0].metadata.mediaLink
        })
      }

      const user = await User.findOrFail(session.get('id'))

      if(fileSaved != null){
        data['photo_id'] = fileSaved.id
      }

      user.merge(data)

      await user.save()

      //return view.render('sign-in')
      response.redirect('/users/show-my-profile')
    }

    async findByNick ({ request, view }) {

      const dados = request.only(['nick'])

      const selectUsers = await User.query()
              .where('nick', 'like', dados.nick)
              .with('photo')
              .fetch()

      const users = selectUsers.toJSON()

      return view.render('list-profiles', { users })
    }

}

module.exports = UserController
