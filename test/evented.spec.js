const tap = require('tap')
const { Evented } = require('../src/evented')

tap.test('#on / #emit', function (t) {
  const evented = new Evented()

  t.type(evented.on, 'function', '#on should be a function')
  t.type(evented.emit, 'function', '#emit should be a function')

  evented.on('test', (data) => {
    t.equals(data, null, 'event data should be null by default')
    t.pass('"test" event has fired')
    t.end()
  })

  evented.emit('test')
})

tap.test('#once', function (t) {
  const evented = new Evented()
  let count = 0

  t.type(evented.once, 'function', '#once should be a function')

  evented.once('test:once', function onceTest () {
    count++
  })

  evented.emit('test:once')
  evented.emit('test:once')

  t.equals(count, 1, 'event handler should have only fired once')
  t.end()
})

tap.test('#off', function (t) {
  const evented = new Evented()
  let count = 0

  t.type(evented.off, 'function', '#off should be a function')

  function test (data) {
    t.equals(data, 'test string', 'data is passed through emit')
    count++
  }

  function test2 () {
    count++
  }

  evented.on('test', test)

  evented.on('test', test2)

  evented.emit('test', 'test string')

  evented.off('test')

  evented.emit('test')

  t.equals(count, 2, 'event handlers should have been removed')
  t.end()
})
