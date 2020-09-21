const Express = require('express');

const app = Express();

app.get('/', (request, response) => {
  return response.json({status: "200", text: "Hello World"});
})

app.listen(3333);