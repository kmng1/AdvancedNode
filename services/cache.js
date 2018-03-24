const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisURL = 'redis://localhost:6379';
const client = redis.createClient(redisURL);
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );
  // console.log(key);

  const cachedValue = await client.get(key);
  if (cachedValue) {
    // console.log(cachedValue);
    return JSON.parse(cachedValue);
  }

  const result = await exec.apply(this, arguments);
  // console.log(result);  // mongoose document
  client.set(key, JSON.stringify(result));
  return result;
};
