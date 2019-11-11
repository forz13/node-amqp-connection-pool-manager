const amqp = require('amqp-connection-manager');

export default class AmqpConnectionManager {

    /**
     *
     * @param {array} urls
     * @param {object} options
     * @param {number} options.heartbeatIntervalInSeconds
     * @param {number} options.reconnectTimeInSeconds
     */
    constructor(urls, options) {
        this._urls = urls;
        this._options = options || {};
        this._initConnected = false;
        this._connection = amqp.connect(this._urls, this._options);
    }

    /**
     *
     * @return {Promise<boolean>}
     */
    connect() {
        return new Promise((resolve, reject) => {
            this._connection.once('connect', () => {
                this._initConnected = true;
                return resolve(true)
            });
            this._connection.once('disconnect', () => {
                if (!this._initConnected) {
                    return reject()
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
            return false;
        }
    }
};
