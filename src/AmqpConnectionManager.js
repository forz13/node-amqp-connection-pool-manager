const amqp = require('amqp-connection-manager');

export default class AmqpConnectionManager {
  /**
     *
     * @param {array} urls
     * @param {object} options
     */
  constructor(urls, options) {
    this._initConnected = false;
    this._connection = amqp.connect(urls, options);
  }

  /**
     *
     * @return {Promise<boolean>}
     */
  connect() {
    return new Promise((resolve, reject) => {
      this._connection.once('connect', () => {
        this._initConnected = true;
        return resolve(true);
      });
      this._connection.once('disconnect', () => {
        if (!this._initConnected) {
          return reject();
        }
      });
    });
  }

  /**
     *
     */
  get connection() {
    return this._connection;
  }

  /**
     *
     * @returns {Promise<boolean>}
     */
  async close() {
    if (!this._connection) {
      return true;
    }
    try {
      await this._connection.close();
      return true;
    } catch (err) {
      console.error(`AmqpConnectionManager connection->close err: ${err.message}`);
      return false;
    }
  }
}
