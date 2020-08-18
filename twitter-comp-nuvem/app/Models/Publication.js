'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Publication extends Model {

    user () {
        return this.belongsTo('App/Models/User')
    }

    photo () {
        return this.belongsTo('App/Models/File', 'photo_id', 'id')
    }

}

module.exports = Publication
