'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {


  async show ({ params, response }) {
    const file = await File.findOrFail(params.id)

    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  async store ({ request, response }) {
    try {
      if (!request.file('file')) {
        return response
          .send({ error: { message: "Nenhum arquivo enviado"}})
      }

      const upload = request.file('file', { size: '2mb' })

      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      if (file) {
        return file
      }

      throw file.error()
    } catch (error) {
      return response
      .status(error.status)
      .send({ error: { message: "Algo deu errado ao fazer o upload"}})
    }
  }
}

module.exports = FileController
