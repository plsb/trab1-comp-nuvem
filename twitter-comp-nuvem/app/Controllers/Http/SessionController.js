'use strict'

class SessionController {
    async store ({ request, response, auth }) {
        const { nick, password } = request.all()

        const token = await auth.attempt(nick, password)

        return token
    }
}

module.exports = SessionController
