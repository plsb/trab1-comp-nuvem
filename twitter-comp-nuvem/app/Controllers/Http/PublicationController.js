'use strict'

const Publication = use('App/Models/Publication')
const Helpers = use('Helpers')
const File = use('App/Models/File') 
const Drive = use('Drive')

class PublicationController {

  async store ({ request, response, session }) {
    let data = {}
    //return data
    request.multipart.field(async (name, value) => {
      data[name] = value  
      console.log(name, value)
    });

    let fileSaved 
  
    await request.multipart
      .file('file', {}, async (file) => {
        if(file){
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
          data['photo_id'] = fileSaved.id
        }
    }).process()
  
    data['user_id'] = session.get('id')

    const publication = await Publication.create(data)

    response.redirect('/home')

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

  async showByPeriod ({ request, view }) {
    const data = request.only(['dt_start', 'dt_end'])

    const selectPub = await Publication.query()
            .where('created_at', '>=', data.dt_start)
            .where('created_at', '<=', data.dt_end)
            .orderBy('created_at', 'desc')
            .with('user.photo')
            .with('photo')
            .fetch()

    const publications = selectPub.toJSON()

    return view.render('welcome', { publications })

  }

}

module.exports = PublicationController
