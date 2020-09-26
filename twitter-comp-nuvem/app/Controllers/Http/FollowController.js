'use strict'

//const Followers = use('App/Models/Followers');
const uuid = require('uuid');

const {Datastore} = require('@google-cloud/datastore');
const path = use('path');

class FollowController {

    async follow({ request, params, session, response }){
      const datastore = new Datastore({
        keyFilename: path.join(__dirname, "../../../chave.json"),
        projectId: 'trab-comp-nuvem'
      });
      const taskKey = datastore.key('followers');
      const entity = {
        key: taskKey,
        data: [
          {
            name: 'user_followed',
            value: params.id,
          },
          {
            name: 'user_id',
            value: session.get('id').toString(),
          },
        ],
      };
      await datastore.save(entity);

      return response.redirect('/users/show/'+params.id)
    }

    async unfollow({ request, response, params, session }){
      const datastore = new Datastore({
        keyFilename: path.join(__dirname, "../../../chave.json"),
        projectId: 'trab-comp-nuvem'
      });
      const query = datastore.createQuery('followers').order('user_id');
      const [followers] = await datastore.runQuery(query);
      console.log('followers:');
      followers.forEach(follower => {
        if(follower.user_id == session.get('id').toString() &&
          follower.user_followed === params.id.toString()){
          const Key = follower[datastore.KEY]
          datastore.delete(Key)

        }
      });
      return response.redirect('/users/show/'+params.id)

    }
}

module.exports = FollowController
