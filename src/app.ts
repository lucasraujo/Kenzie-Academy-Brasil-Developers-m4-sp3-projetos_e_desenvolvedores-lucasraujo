import express, { Application} from 'express'
import {startDatabase }from './database'
import { createDeveloper, getDeveloper, getDeveloperById, addInfos, UpdateDevByID, UpdateInfosByID, deleteDevByID} from './logics/developer.logics'
import {developerNotFound, emailAlreadyRegistered, validateKeysRequired, validateKeysRequiredOFInfos} from './middlewares/developer.middlewares'
import { createProjects, getProjects, getProjectsById , updateProjectsById, deleteProjectsById,getProjectsOfDeveloperById, addTechnologiesToProjects,deleteTecnologieFromProjectByName} from './logics/projects.logics'
import { projectsNotFound, projectsNotFoundByDeveloperId } from './middlewares/projects.middlewares'
const app: Application = express()
app.use(express.json())


app.post('/developers', validateKeysRequired , emailAlreadyRegistered , createDeveloper )
app.get('/developers', getDeveloper )
app.get('/developers/:id', developerNotFound, getDeveloperById )
app.post('/developers/:id/infos', developerNotFound, validateKeysRequiredOFInfos, addInfos )
app.patch('/developers/:id', developerNotFound, UpdateDevByID )
app.patch('/developers/:id/infos', developerNotFound, UpdateInfosByID )
app.delete('/developers/:id', developerNotFound, deleteDevByID )

app.post('/projects', createProjects)
app.get('/projects', getProjects)
app.get('/projects/:id', projectsNotFoundByDeveloperId, getProjectsById)
app.patch('/projects/:id', projectsNotFound, updateProjectsById)
app.delete('/projects/:id', projectsNotFound, deleteProjectsById)

app.get('/developers/:id/projects',  developerNotFound, getProjectsOfDeveloperById)
app.post('/projects/:id/technologies', projectsNotFound, addTechnologiesToProjects)
app.delete('/projects/:id/technologies/:name', projectsNotFound, deleteTecnologieFromProjectByName)




app.listen(3000, () => {
    console.log('Server is running!')
    startDatabase()
})