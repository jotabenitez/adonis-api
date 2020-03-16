'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Task extends Model {
  static boot () {
    super.boot()

    this.addHook('afterSave', 'TaskHook.sendNewTaskMail')
    this.addHook('beforeUpdate', 'TaskHook.sendNewTaskMail')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  projects () {
    return this.belongsTo('App/Models/Project')
  }

  files () {
    return this.hasOne('App/Models/File')
  }
}

module.exports = Task
