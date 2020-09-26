'use strict'

const Publication = use("App/Models/Publication")

const {Datastore} = require('@google-cloud/datastore');
const path = use('path');

class HomeController {


    async home ({ request, view, session }) {
      let followers_id = [], indice = 0

      const datastore = new Datastore({
        keyFilename: path.join(__dirname, "../../../chave.json"),
        projectId: 'trab-comp-nuvem'
      });
      const query = datastore.createQuery('followers').order('user_id');
      const [followers] = await datastore.runQuery(query);
      console.log('followers:');

      for (const follower of followers) {
        if (follower.user_id == session.get('id').toString()) {
          followers_id[indice] = follower.user_followed
          indice++
        }

      }

      followers_id[indice] = session.get('id').toString()

      const selectPub = await Publication.query()
            .whereIn('user_id', followers_id)
            .orderBy('created_at', 'desc')
            .with('user.photo')
            .with('photo')
            .fetch()

      const publications = selectPub.toJSON()
      //return publications
      return view.render('welcome', { publications })

    }

}

module.exports = HomeController
