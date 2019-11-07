const AmqpConnectionPoolManager = require('./AmqpConnectionPoolManager');

export function connect(urls, options) {
    return new AmqpConnectionPoolManager(urls, options);
}

const amqp = {
    connect
};

export default amqp;