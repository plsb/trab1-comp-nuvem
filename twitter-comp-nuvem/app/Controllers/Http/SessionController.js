'use strict'

const User = use('App/Models/User')

class SessionController {
    async store ({ request, response, auth, view, session }) {
        const { nick, password } = request.all()

        const token = await auth.attempt(nick, password)
        
        if(token.token){
            const select = await User.query()
                .where('nick', nick)
                .first()
            session.put('nick', nick)
            session.put('id', select.id)
            return response.redirect('/home') 
        }
        
        return view.render('error-login')
    }
}

module.exports = SessionController
