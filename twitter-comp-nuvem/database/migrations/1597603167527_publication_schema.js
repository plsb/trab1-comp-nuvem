'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublicationSchema extends Schema {
  up () {
    this.create('publications', (table) => {
      table.increments()
      table.string('description', 254).notNullable()
      table
        .integer('photo_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('publications')
  }
}

module.exports = PublicationSchema
