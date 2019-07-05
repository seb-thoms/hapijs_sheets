const hapi = require('@hapi/hapi')
const routes = require('./routes/routes')
const bell = require('@hapi/bell')
const cookie = require('@hapi/cookie')

const internals = {}

internals.start = async function () {
  const server = hapi.server({ host: 'localhost', port: 3000 })
  //REGISTER PLUGINS HERE
  await server.register([bell, cookie])

  //WRITE STRATEGIES HERE

  //SESSION STRATEGY
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'sid',
      password: 'cookie_encryption_password_secure',
      isSecure: false,
      isHttpOnly: true,
    },
    redirectTo: '/login',
    validateFunc: async (request, session) => {
      const account = true
      if (!account) {
        return { valid: false, credentials: null }
      }
      return { valid: true, credentials: { session: session.id, email: session.email } }
    },
  });

  //OAUTH STRATEGY
  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: 'cookie_encryption_password_secure',
    isSecure: false,
    clientId: '253026269170-7h08durq259pq1smh2uf34s3u3jk6rq9.apps.googleusercontent.com',
    clientSecret: 'Cy9yccyWec03FtQBz7qW2qtV',
    location: server.info.uri
  });

  server.auth.default('session')

  //REGISTER ROUTES HERE
  server.route(routes)

  //START SERVER
  await server.start()
  console.log("Server started at : ", server.info.uri)
}

internals.start()