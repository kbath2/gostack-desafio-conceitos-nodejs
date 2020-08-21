const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const {title} = request.query;

    const results = title 
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

    return response.json(results)
    console.log(results)
});

app.post("/repositories", (request, response) => {
    const {title, url, techs} = request.body;

    const repository = { id: uuid(), title, url, techs, likes:0 };

    repositories.push(repository)

    return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findIndex = repositories.findIndex(repository => repository.id === id);
  
  if (findIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'})
  }

    repositories[findIndex] = {
    id, 
    title,
    url,
    techs,
    likes: repositories[findIndex].likes,
  };

  return response.json(repositories[findIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found'})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository does not exists."})
  }

  repositories[repositoryIndex].likes++

  return response.json(repositories[repositoryIndex])

});

module.exports = app;
