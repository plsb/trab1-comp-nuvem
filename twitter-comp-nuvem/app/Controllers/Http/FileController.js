'use strict'

const File = use('App/Models/File')
const Drive = use('Drive')
const Helpers = use('Helpers')
//var AWS = require('aws-sdk')
var uuid = require('uuid')

class FileController {
  async show ({ request, response, params }) {
    const file = await File.findOrFail(params.id)
    
    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  async store ({ request, response }) {
    let fileSaved

    await request.multipart
      .file('file', {}, async file => {
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
    }).process()

    return fileSaved

    

    
    /*try{
      if(!request.file('file')){
        return
      }
      const upload = request.file('file', { size: '2mb'})

      const fileName = `${Date.now()}.${upload.subtype}`
      
      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })
      
      if(!upload.move()) {
        throw upload.error()
      }   

      const file = await File.create({
        file: fileName,
        name: upload.clientName
      })

      return upload

    } catch (err) {
      console.log(err)
      return response
        .status(err.status)
        .send()
    }*/

  }


}

module.exports = FileController
