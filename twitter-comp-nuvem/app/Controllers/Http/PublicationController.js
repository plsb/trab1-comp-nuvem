'use strict'

const Publication = use('App/Models/Publication')
const Helpers = use('Helpers')
const File = use('App/Models/File')
const Drive = use('Drive')

const {Storage} = use('@google-cloud/storage')
const path = use('path');

const gc = new Storage({
  keyFilename: path.join(__dirname, "../../../chave.json"),
  projectId: 'trab-comp-nuvem'
});

const trabNuvemBucket = gc.bucket('trab-nuvem')

class PublicationController {

  async store ({ request, response, session }) {
    let data = {}
    //return data
    request.multipart.field(async (name, value) => {
      data[name] = value
    });

    let fileSaved

    await request.multipart
      .file('file', {}, async (file) => {
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
