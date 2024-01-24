const Redis = require('redis');

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient({legacyMode: true});
        this.publisher = Redis.createClient({legacyMode: true});
    }

    publish(chanel, message) {
        return new Promise((resolve, reject) => {
            this.publisher.publish(chanel, message, (err, reply) => {
                if(err) reject(err);

                resolve(reply);
            })
        })
    }
    
    subscribe(chanel, callback) {
        this.subscriber.subscribe(chanel);
        this.subscriber.on('message', (subscribeChanel, message) => {
            if(chanel === subscribeChanel) {
                callback(chanel, message)
            }
        })
    }
}

module.exports = new RedisPubSubService()
