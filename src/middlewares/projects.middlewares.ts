import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";

export const projectsNotFound = async (request : Request , response : Response  , next : NextFunction ): Promise<Response | void> => {

  const idRequest = request.params.id

  const query : string = `

  SELECT
      pro.id, pro.name, pro.description, pro."estimatedTime", pro.repository, pro."startDate", pro."endDate", pro."developerId", protec."technologyId", te."technologyName"
  FROM 
      projects pro
  LEFT JOIN 
      projects_technologies protec ON (pro.id = protec."projectsId")
  LEFT JOIN
      technologies te ON (te.id = protec."technologyId")
  WHERE 
      pro.id = $1 ;
  `

  const queryConfig : QueryConfig = {
      text:query,
      values:[idRequest]
  }

  const queryResult = await client.query(queryConfig)

  
    if(queryResult.rowCount === 0 ){
  
      return response.status(404).json({
        message: "projects not found."
    })
  
    }
  
    return next()
  
  }

  export const projectsNotFoundByDeveloperId = async (request : Request , response : Response  , next : NextFunction ): Promise<Response | void> => {

    const idRequest = request.params.id
  
    const query : string = `
  
    SELECT
        pro.id, pro.name, pro.description, pro."estimatedTime", pro.repository, pro."startDate", pro."endDate", pro."developerId", protec."technologyId", te."technologyName"
    FROM 
        projects pro
    LEFT JOIN 
        projects_technologies protec ON (pro.id = protec."projectsId")
    LEFT JOIN
        technologies te ON (te.id = protec."technologyId")
    WHERE 
        pro.id = $1 ;
    `
  
    const queryConfig : QueryConfig = {
        text:query,
        values:[idRequest]
    }
  
    const queryResult = await client.query(queryConfig)
  
    
      if(queryResult.rowCount === 0 ){
    
        return response.status(404).json({
          message: "developer not found."
      })
    
      }
    
      return next()
    
    }


