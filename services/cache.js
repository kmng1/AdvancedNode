const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisURL = 'redis://localhost:6379';
const client = redis.createClient(redisURL);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify((options.key) || '');
  // console.log('Hash key: ', this.hashKey);
  return this;
};

mongoose.Query.prototype.exec = async function() {

  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );
  // console.log('Key: ', key);

  const cachedValue = await client.hget(this.hashKey, key);
  // console.log('Cached Value: ', cachedValue);
  if (cachedValue) {
    console.log('Returning cached value');
    const doc = JSON.parse(cachedValue);
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  console.log('Query from DB');  // result is a mongoose document
  client.hset(this.hashKey, key, JSON.stringify(result), function (err, res) {  // 'EX', 10  // auto cache expiry 10 secs
    if (err) {
      console.log('hset error:', err);
    }
    if (res) {
      console.log('hset res:', res);
    }
  });
  client.expire(this.hashKey, 10);
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
