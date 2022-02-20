Wrapper for amqp-connection-manager that manages pool of amqp connections

# node-amqp-connection-pool-manager

## Features


## Installation

    npm install --save amqp-connection-pool-manager

## Basics

    const pool = require('amqp-connection-pool-manager');
    const amqp = pool.create([], {}, 2,2);
    await amqp.open();
    const senderConnection = amqp.senderConnection;
    const consumerConnection = amqp.consumerConnection;

