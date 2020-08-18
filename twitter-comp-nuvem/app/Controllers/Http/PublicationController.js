'use strict'

const Publication = use('App/Models/Publication')

class PublicationController {
 
  async index ({ request, response, view }) {
  }

  async create ({ request, response, view }) {
  }

  async store ({ request, response }) {
    const data = request.only(['description', 'photo_id', 'user_id'])

    const publication = await Publication.create(data)

    return publication
  }

  async show ({ params }) {
    const publication = await Publication.query()
            .where('id', params.id)
            .with('user')
            .with('photo')
            .fetch()
          
    return publication
  }

  async showByUser ({ params }) {
    const publications = await Publication.query()
            .where('user_id', params.id)
            .with('user')
            .with('photo')
            .fetch()
          
    return publications
  }

  async showByPeriod ({ request }) {
    const data = request.only(['dt_start', 'dt_end'])

    const publications = await Publication.query()
            .where('created_at', '>=', data.dt_start)
            .where('created_at', '<=', data.dt_end)
            .with('user')
            .with('photo')
            .fetch()
          
    return publications
  }

  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = PublicationController
