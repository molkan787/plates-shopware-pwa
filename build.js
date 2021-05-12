const { loadNuxt, build } = require('nuxt')

// Get a ready to use Nuxt instance
loadNuxt('start').then(nuxt => {

    build(nuxt)

})
