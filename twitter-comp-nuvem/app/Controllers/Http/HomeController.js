'use strict'

const Publication = use("App/Models/Publication")

const Followers = use('App/Models/Followers');

class HomeController {


    async home ({ request, view, session }) {
      let followers = []

      const followAll = await Followers.scan().exec(); 
      const followSpec = followAll.filter(function (a) {
          return a.user_id === session.get('id').toString();
      });

      for (var j = 0; j < followSpec.length; j++){
        followers[j] = followSpec[j].user_followed
      }
      
      followers[j] = session.get('id').toString()

      const selectPub = await Publication.query()
            .whereIn('user_id', followers)   
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
