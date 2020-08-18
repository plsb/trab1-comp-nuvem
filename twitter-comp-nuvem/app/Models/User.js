'use strict'

const Hash = use('Hash')
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  publications () {
    return this.hasMany('App/Models/Publication')
  }

  photo () {
    return this.belongsTo('App/Models/File', 'photo_id', 'id')
  }

  followers () {
    return this.belongsToMany('App/Models/User', 'user_id', 'user_followed_id', 'id', 'id')
    .pivotTable('user_follow_users')
  }

  
}

module.exports = User
