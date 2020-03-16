'use strict'

const Env = use('Env')

module.exports = {
  sentry: {
    dsn: Env.get('Sentry_DSN')
  }
}