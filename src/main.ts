window.document.addEventListener('click', () => {
  import(/* webpackPrefetch: true */ './utils')
    .then(({ default: func }) => console.log('test', func(1, 2)))
})