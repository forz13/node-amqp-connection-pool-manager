const EventEmitter = require('events');
const AmqpConnectionManager = require('./AmqpConnectionManager');

export default class AmqpConnectionPoolManager extends EventEmitter {
  /**
     *
     * @param  urls
     * @param {object} options
     * @param {number} consumerPoolSize
     * @param {number} senderPoolSize
     */
  constructor(urls, options, consumerPoolSize, senderPoolSize) {
    super();
    /**
         *
         * @type {number}
         * @private
         */
    this._consumerPoolSize = consumerPoolSize;

    /**
         *
         * @type {number}
         * @private
         */
    this._senderPoolSize = senderPoolSize;

    /**
         *
         * @type {Map<number, object>}
         * @private
         */
    this._consumerPool = new Map();

    /**
         *
         * @type {Map<number, object>}
         * @private
         */

    this._senderPool = new Map();

    this._urls = urls;

    this._options = options;
  }

  /**
     *
     * @return {*}
     */
  get senderConnection() {
    const key = this._getRandomKey(this._senderPool);
    return this._senderPool[key].connection;
  }

  /**
     *
     * @return {*}
     */
  get consumerConnection() {
    const key = this._getRandomKey(this._consumerPool);
    return this._consumerPool[key].connection;
  }

  /**
     *
     * @return {Promise<void>}
     */
  async open() {
    for (let i = 0; i < this._consumerPoolSize; i++) {
      const consumer = new AmqpConnectionManager(this._urls, this._options);
      this._consumerPool.add(i, consumer);
    }

    for (let i = 0; i < this._senderPoolSize; i++) {
      const sender = new AmqpConnectionManager(this._urls, this._options);
      this._senderPool.add(i, sender);
    }
    for (const consumerConnection of this._consumerPool.values()) {
      await consumerConnection.connect();
      this._connectionEventHandler(consumerConnection);
    }

    for (const senderConnection of this._senderPool.values()) {
      await senderConnection.connect();
      this._connectionEventHandler(senderConnection);
    }
  }

  /**
     *
     * @return {Promise<void>}
     */
  async close() {
    const connections = [...this._consumerPool.values(), ...this._senderPool.values()];
    for (const connection of connections) {
      await connection.close();
    }
  }

  /**
     *
     * @private
     */
  _connectionEventHandler(connection) {
    connection.on('connect', () => EventEmitter.emit('connect'));
    connection.on('disconnect', (err) => EventEmitter.emit('disconnect', err));
  }

  /**
     *
     * @param collection
     * @return {number|string}
     * @private
     */
  _getRandomKey(collection) {
    const keys = Array.from(collection.keys());
    return keys[Math.floor(Math.random() * keys.length)];
  }
}
