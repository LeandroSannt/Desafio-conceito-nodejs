const express = require("express");
const cors = require("cors");
const { v4: uuidv4} = require('uuid');
const isuuid = require('isuuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validateRepositoryId(req,res,next){

  const {id} = req.params

  if(!isuuid(id)){
      return res.status(400).json({error:"Invalid id"})
  }

  return next()

}


app.use("/repositories/:id",validateRepositoryId)


app.get("/repositories", (request, response) => {
 return response.json(repositories)
});

app.post("/repositories", (request, response) => {

    const {title, url, techs,like} = request.body
    const repository = {
      id:uuidv4(),
      title,
      url,
      techs,
      like:0
    }

    repositories.push(repository)

    return response.json(repositories)

  
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params

    const repositoryFind = repositories.find(repository => repository.id == id)

    if(!repositoryFind){
        return response.status(400).json({error: "Repository not found"})
    }

    const {title, url,techs, like} = request.body



    const repository = {
        id,
        title,
        url,
        techs,
        like:repositoryFind.like
    }


    repositories[repositoryFind] = repository

  return response.json(repository)


});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if(repositoryIndex < 0){
      return response.status(400).json({error: "Project not found"})
  }

  repositories.splice(repositoryIndex,1)

  return response.status(204).send()
}); 

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params
    const {like} = request.body

    const findRepository = repositories.find(repository => repository.id == id)

    ++findRepository.like 

    return response.json(findRepository)
});

module.exports = app;
