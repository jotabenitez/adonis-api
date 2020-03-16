'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.put('users/:id', 'UserController.update').middleware(['auth'])
Route.get('users/:id', 'UserController.show').middleware('auth')

Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator('ForgotPassword')
Route.put('passwords', 'ForgotPasswordController.update').validator('ResetPassword')

Route.get('files/:id', 'FileController.show')

Route.group(() => {
  
  Route.post('files', 'FileController.store')
  
  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .except(['index', 'show'])
    .validator(new Map(
      [
        [
          ['projects.store'],
          ['Project']
        ]
      ]
    ))
  
  Route.resource('projects.tasks', 'TaskController')
    .apiOnly()
    .except(['index', 'show'])
    .validator(new Map(
      [
        [
          ['projects.tasks.store'],
          ['Task']
        ]
      ]
    ))

  
  Route.resource('permission', 'PermissionController').apiOnly()

  Route.resource('roles', 'RoleController').apiOnly()
    
}).middleware(['auth', 'is:(administrator || moderator)'])

Route.get('projects', 'ProjectController.index')
  .middleware(['auth', 'can:read_projects'])

Route.get('projects/:id', 'ProjectController.show')
  .middleware(['auth', 'can:read_projects'])

Route.get('projects/:id/tasks', 'TaskController.index')
  .middleware(['auth', 'can:read_projects'])

Route.get('projects/:id/tasks/:id', 'TaskController.show')
  .middleware(['auth', 'can:read_projects'])