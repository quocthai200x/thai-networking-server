const { Client } = require('@elastic/elasticsearch')


const elasticClient = new Client({
    cloud: {
      id: 'ElasticSearch_Thai-work-net:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRkNTc2MTFkZDZhZDk0MzEzOWM3MGMxNTAyOTEyMDYzNyQ5MDdkMGJlNzVhMDU0MWZjOTY1NWE1YjVkODViMDkwOQ=='
    },
    auth: {
      username: 'quocthai',
      password: 'Thai123456'
    }
  })




module.exports = elasticClient;