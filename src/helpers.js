/**
 * Get random item from array
 * @param {Array} items
 * @return {*}
 */
exports.randomItem = items => items[Math.floor(Math.random() * items.length)];