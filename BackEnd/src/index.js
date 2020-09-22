const Express = require('express');
const {
  uuid,
  isUuid
} = require('uuidv4');

const app = Express();

app.use(Express.json());


const projects = [];

function Middleware(req, res, next) {
  const {
    method,
    url
  } = req;

  const label = `[${method.toUpperCase()}] ${url}`;

  console.log(label);
  return next();
}

function ValidateProjectID(req, res, next) {
  const {
    id
  } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      error: "Id Invalido!"
    });
  }

  return next();
}

app.use(Middleware);

app.use('/projects/:id', ValidateProjectID);


app.get('/projects', (request, response) => {
  const {
    title
  } = request.query;

  const results = title ?
    projects.filter(project => project.title.includes(title)) :
    projects;

  return response.json(results);
})

app.post('/projects', (request, response) => {
  const {
    title,
    dev
  } = request.body;
  const project = {
    id: uuid(),
    title,
    dev
  };

  projects.push(project);

  return response.json(project);
})

app.put('/projects/:id', (request, response) => {
  const {
    id
  } = request.params;
  const {
    title,
    dev
  } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({
      error: "Project Not Found."
    })
  }

  const project = {
    id,
    title,
    dev
  };

  projects[projectIndex] = project;

  return response.json(project);
})

app.delete('/projects/:id', (request, response) => {
  const {
    id
  } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({
      error: "Project Not Found."
    })
  }

  projects.splice(projectIndex, 1);


  return response.status(204).send();
})

app.listen(3333, () => {
  console.log("⚡️ backend started")
});