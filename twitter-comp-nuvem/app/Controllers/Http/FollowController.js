'use strict'

const Followers = use('App/Models/Followers');
const uuid = require('uuid');

class FollowController {

    async follow({ request, params, session, response }){
      let data = {}
      data['id'] = uuid.v1()
      data['user_id'] = session.get('id').toString()
      data['user_followed'] = params.id
      
      const follow = await Followers.create(data);
      
      return response.redirect('/users/show/'+params.id)
    }

    async unfollow({ request, params, session }){
      const followAll = await Followers.scan().exec(); 
      const followSpecific = followAll.filter(function (a) {
          return a.user_id === session.get('id').toString()
              && a.user_followed === params.id.toString();
      })
      //return followSpecific[0].id
      const Follow = await Followers.scan("id").contains(followSpecific[0].id).exec()
      
      await Followers.delete({"id": followSpecific[0].id});
      return request.json({msg: 'Deleted'});


    }
}

module.exports = FollowController
