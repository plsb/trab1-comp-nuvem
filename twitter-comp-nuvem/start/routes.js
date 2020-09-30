'use strict'

const Route = use('Route')

Route.get('/home', 'HomeController.home') //.render('welcome')
Route.get('/sign-up', ({ view }) => {
    return view.render('sign-up')
})
Route.get('/', ({ view }) => {
    return view.render('sign-in')
})
Route.get('post-twitter', ({ view }) => {
    return view.render('post-twitter')
})
Route.get('/users/show-my-profile',
        'UserController.showMyProfile').as('user.show.my.profile')
Route.get('/users/show/:id',
        'UserController.show').as('user.show')
Route.post('/sessions', 'SessionController.store').as('user.signin')
Route.post('/users', 'UserController.store').as('user.signup')
Route.get('/edit-profile', 'UserController.edit').as('user.edit')
Route.post('/users/update', 'UserController.update').as('user.update')
Route.post('/publications', 'PublicationController.store').as('publication.store')
Route.get('/users/find-nick', 'UserController.findByNick').as('user.find.nick')
Route.post('/follow/:id', 'FollowController.follow').as('user.follow')
Route.post('/unfollow/:id', 'FollowController.unfollow').as('user.unfollow')
Route.get('/publications/show-by-period', 'PublicationController.showByPeriod').as('publication.show.period')


Route.get('/users/show/:id', 'UserController.show').as('user.show')
Route.get('/files/:id', 'FileController.show')
Route.post('/files', 'FileController.store').as('files.store')
Route.get('/publications/show/:id', 'PublicationController.show')
Route.get('/publications/show-by-user/:id', 'PublicationController.showByUser')
