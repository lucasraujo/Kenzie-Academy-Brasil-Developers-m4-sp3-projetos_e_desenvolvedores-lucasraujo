import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";

export const validateKeysRequired = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const requiredKeyName = "name";
  const requiredKeyEmail = "email";

  const requestKeys = Object.keys(request.body);

  if (!requestKeys.includes(requiredKeyName)) {
    return response.status(400).json({
      message: "Missing required keys: name.",
    });
  }

  if (!requestKeys.includes(requiredKeyEmail)) {
    return response.status(400).json({
      message: "Missing required keys: email.",
    });
  }

  return next();
};

export const emailAlreadyRegistered = async (
  request: Request,
  response: Response,
  next: NextFunction
  ): Promise<Response | void> => {
      
      const emailRequest = request.body.email
    const query = `

    SELECT
        *
    FROM 
        developers 
    WHERE 
        email = $1
    
    `
   const queryConfig : QueryConfig = {
    text: query,
    values : [emailRequest]
   }

   const queryResult  = await client.query(queryConfig)



if(queryResult.rowCount > 0) {
    return response.status(409).json({
        message: "Email already exists."
    })
}

   return next()


};

export const developerNotFound =async (request : Request , response : Response  , next : NextFunction ): Promise<Response | void> => {

  const idRequest = request.params.id;

  const query = `
  
  SELECT
      * 
  FROM 
      developers  
  WHERE
      id = $1
  
  `
  const queryConfig : QueryConfig = {
    text: query,
    values: [idRequest]
  }

  const queryResult = await client.query(queryConfig)

  if(queryResult.rowCount === 0 ){

    return response.status(404).json({
      message: "Developer not found."
  })

  }

  return next()

}

export const validateKeysRequiredOFInfos = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const requiredKeyName = "developerSince";
  const requiredKeyEmail = "preferredOS";

  const requestKeys = Object.keys(request.body);

  if (!requestKeys.includes(requiredKeyName ) && !requestKeys.includes(requiredKeyEmail)) {
    return response.status(400).json({
      message: "developerSince,preferredOS."
    });
  }
  
  if (!requestKeys.includes(requiredKeyName)) {
    return response.status(400).json({
      message: "Missing required keys: developerSince.",
    });
  }

  if (!requestKeys.includes(requiredKeyEmail)) {
    return response.status(400).json({
      message: "Missing required keys: preferredOS",
    });
  }

  return next();
};