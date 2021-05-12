const { loadNuxt, build } = require('nuxt')
const http = require('http')

// Check if we need to run Nuxt in development mode
const isDev = process.env.NODE_ENV !== 'production'

// Get a ready to use Nuxt instance
loadNuxt(isDev ? 'dev' : 'start').then(nuxt => {

    // Enable live build & reloading on dev
    if (isDev) {
        build(nuxt)
    }
    
    // We can use `nuxt.render(req, res)` or `nuxt.renderRoute(route, context)`
    
    
    http.createServer(function (req, res) {
        nuxt.render(req, res)
    }).listen(process.env.PORT || 80);

})
