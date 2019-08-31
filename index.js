const express = require('express');

const server = express();

server.use(express.json());

let numberOfRequests = 0;

const projects = [];


//Middlewares que checa se o projeto existe

function checkProjectExists(req, res, next){
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({ error: 'Project not found'});
  }

  return next();
}

function logRequests(req, res, next){
  numberOfRequests++

  console.log(`Number of Requests: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

//lista todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//lista um projeto
server.get('/projects/:id', (req, res) =>{
  const { id } = req.params;

  return res.json(projects[id]);
  
});


server.post('/projects', (req, res) =>{
  const {id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);

});

  //task// 
server.post('/projects/:id/tasks', checkProjectExists, (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);

});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();

});

server.listen(3333);