const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/server',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: {
        '^/server': '/server'
      },
      onProxyReq: (proxyReq, req, res) => {
        if (req.session && req.session.userId) {
          const token  = req.session.userId;
          proxyReq.setHeader('Authorization', `Bearer ${token}`);
          // proxyReq.setHeader('X-Username', username);
        }
      }
    })//createProxyMiddleware
  )
}
