const AmqpConnectionPoolManager = require('./AmqpConnectionPoolManager');

/**
 * @param  urls
 * @param {object} options
 * @param {number} consumerPoolSize
 * @param {number} senderPoolSize
 */
function create(urls, options, consumerPoolSize, senderPoolSize) {
  return new AmqpConnectionPoolManager(urls, options, consumerPoolSize, senderPoolSize);
}

const pool = {
  create,
};

export default pool;
