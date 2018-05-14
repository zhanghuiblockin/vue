if (process.env.NODE_ENV !== 'production') {
  console.warn('NODE_ENV = ' + process.env.NODE_ENV)
}

export default require(`./config.${process.env.NODE_ENV}`)
