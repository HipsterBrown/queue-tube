class Evented {
  constructor () {
    this.eventMap = new Map()
  }

  handlers (eventName) {
    return this.eventMap.get(eventName) || new Set()
  }

  emit (eventName, data = null) {
    this.handlers(eventName).forEach(handler => handler(data))
  }

  on (eventName, handler) {
    this.eventMap.set(eventName, this.handlers(eventName).add(handler))
  }

  once (eventName, handler) {
    const self = this
    function wrapper (data) {
      handler(data)
      self.off(eventName, wrapper)
    }

    this.on(eventName, wrapper)
  }

  off (eventName, handler) {
    if (handler) {
      this.handlers(eventName).delete(handler)
    } else {
      this.eventMap.delete(eventName)
    }
  }
}

module.exports = { Evented }
