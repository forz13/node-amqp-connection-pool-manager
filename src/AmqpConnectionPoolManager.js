const AmqpConnectionManager = require('./AmqpConnectionManager');
const helpers = require('./helpers');

export default class AmqpConnectionPoolManager {

    /**
     *
     * @param {object} connectionOptions
     * @param {string} connectionOptions.host
     * @param {number} connectionOptions.port
     * @param {string} connectionOptions.username
     * @param {string} connectionOptions.password
     * @param {string} connectionOptions.vhost
     * @param {number} connectionOptions.heartbeatIntervalInSeconds
     * @param {number} connectionOptions.reconnectTimeInSeconds
     * @param {number} consumerPoolSize
     * @param {number} senderPoolSize
     */
    constructor(connectionOptions, consumerPoolSize, senderPoolSize) {
        this._consumerPoolSize = consumerPoolSize;
        this._senderPoolSize = senderPoolSize;
        this._consumerPool = [];
        this._senderPool = [];
        this._url = this._createUrl(connectionOptions);
        this._options = this._createOptions(connectionOptions);
    }

    /**
     *
     * @return {*}
     */
    get senderConnection() {
        return helpers.randomItem(this._senderPool).connection;
    }

    /**
     *
     * @return {*}
     */
    get consumerConnection() {
        return helpers.randomItem(this._consumerPool).connection;
    }

    /**
     *
     * @return {Promise<void>}
     */
    async open() {
        for (let i = 0; i < this._consumerPoolSize; i++) {
            const consumer = new AmqpConnectionManager([this._url], this._options);
            this._consumerPool.push(consumer);
        }

        for (let i = 0; i < this._senderPoolSize; i++) {
            const sender = new AmqpConnectionManager([this._url], this._options);
            this._senderPool.push(sender);
        }

        this._consumerPool.map(async connection => await connection.connect());
        this._senderPool.map(async connection => await connection.connect());
    }

    /**
     *
     * @return {Promise<void>}
     */
    async close() {
        this._senderPool.map(async connection => await connection.close());
        this._consumerPool.map(async connection => await connection.close());
    }

    /**
     *
     * @return {string}
     * @private
     */
    _createUrl(connectionOptions) {
        let vhost = connectionOptions.vhost || '/';
        vhost = encodeURIComponent(vhost);
        const userName = connectionOptions.username;
        const password = connectionOptions.password;
        const host = connectionOptions.host;
        const port = connectionOptions.port;
        return `amqp://${userName}:${password}@${host}:${port}/${vhost}`;
    }

    /**
     *
     * @return {{heartbeatIntervalInSeconds: *, reconnectTimeInSeconds: *}}
     * @private
     */
    _createOptions(connectionOptions) {
        return {
            heartbeatIntervalInSeconds: connectionOptions.heartbeatIntervalInSeconds || 5,
            reconnectTimeInSeconds: connectionOptions.reconnectTimeInSeconds,
        }

    }
}