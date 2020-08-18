'use strict'

const Route = use('Route')

Route.on('/').render('welcome')
Route.get('sign-up', ({ view }) => {
    return view.render('sign-up')
})
Route.get('sign-in', ({ view }) => {
    return view.render('sign-in')
})



//api
Route.get('/users/show/:id', 'UserController.show')
Route.get('/users/find-nick', 'UserController.findByNick')
Route.post('/users', 'UserController.store')
Route.put('/users/:id', 'UserController.update')

Route.post('/sessions', 'SessionController.store')

Route.get('/files/:id', 'FileController.show')
Route.post('/files', 'FileController.store')

Route.get('/publications/show/:id', 'PublicationController.show')
Route.get('/publications/show-by-user/:id', 'PublicationController.showByUser')
Route.get('/publications/show-by-period', 'PublicationController.showByPeriod')
Route.post('/publications', 'PublicationController.store')

