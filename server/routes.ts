process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = ['modeller', 'integration']
  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, router) => {})
