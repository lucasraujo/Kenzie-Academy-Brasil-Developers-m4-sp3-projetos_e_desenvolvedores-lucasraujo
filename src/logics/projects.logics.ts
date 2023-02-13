import { Request, Response } from "express";
import { Query, QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";

export const createProjects = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const missingKeys: Array<string> = [];
  const keysRequired = [
    "name",
    "description",
    "estimatedTime",
    "repository",
    "startDate",
    "developerId",
  ];
  const keysRequestBody = Object.keys(request.body);
  const requestBody = request.body;
  const {
    name,
    description,
    estimatedTime,
    repository,
    startDate,
    endDate,
    developerId,
  } = requestBody;
  const usualRequestBody = {
    name: name,
    description: description,
    estimatedTime: estimatedTime,
    repository: repository,
    startDate: startDate,
    endDate: endDate,
    developerId: developerId,
  };

  keysRequired.forEach((ele) => {
    if (keysRequestBody.includes(ele) === false) missingKeys.push(ele);
  });
  if (missingKeys.length > 0)
    response
      .status(400)
      .json({ message: `Missing required keys: ${missingKeys}` });

  const queryValidate: string = `
        SELECT 
            * 
        FROM 
            developers
        WHERE
            developers.id = $1 ;
    `;
  const queryValidateConfig: QueryConfig = {
    text: queryValidate,
    values: [usualRequestBody.developerId],
  };

  const queryValidateResponse = await client.query(queryValidateConfig);

  if (queryValidateResponse.rowCount < 1)
    response.status(404).json({ message: "Developer not found" });

  const query: string = format(
    `
        INSERT INTO 
            projects (%I)
        VALUES (%L) 
        RETURNING *;
       `,
    Object.keys(usualRequestBody),
    Object.values(usualRequestBody)
  );

  const queryResult = await client.query(query);

  return response.status(201).json(queryResult.rows[0]);
};



export const getProjects = async (request : Request , response : Response) : Promise<Response> => {


    const query : string = `

    SELECT
        pro.id, pro.name, pro.description, pro."estimatedTime", pro.repository, pro."startDate", pro."endDate", pro."developerId", protec."technologyId", te."technologyName"
    FROM 
        projects pro
    LEFT JOIN 
        projects_technologies protec ON (pro.id = protec."projectsId")
    LEFT JOIN
        technologies te ON (te.id = protec."technologyId");
    `
    const queryResult = await client.query(query)
    return response.status(200).json(queryResult.rows) 
}


export const getProjectsById = async (request : Request , response : Response) : Promise<Response> => {

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


  

  return response.status(200).json(queryResult.rows) 
}



export const updateProjectsById = async (request : Request , response : Response) : Promise<Response> => {

  const missingKeys: Array<string> = [];
  const keysRequired = ["name","description", "estimatedTime", "repository","startDate","endDate","developerId"];
  const keysRequestBody = Object.keys(request.body);
  const requestBody = request.body;
  const {name, description,estimatedTime,repository,startDate,endDate, developerId,} = requestBody;
  const usualRequestBody = {name: name,description: description,estimatedTime: estimatedTime,repository: repository,startDate: startDate,endDate: endDate, developerId: developerId};
  const idRequest = request.params.id


  keysRequired.forEach((ele) => {
    if (keysRequestBody.includes(ele) === false) missingKeys.push(ele);
  });

  if (missingKeys.length === keysRequired.length)
    response
      .status(400)
      .json({ message: "At least one of those keys must be send.", keys:`${missingKeys}` });

      let usualObject = {}

      if(usualRequestBody.name != undefined ) usualObject ={ ...usualObject, name: name}
      if(usualRequestBody.description != undefined ) usualObject ={ ...usualObject, description: description}
      if(usualRequestBody.estimatedTime != undefined ) usualObject ={ ...usualObject, estimatedTime: estimatedTime}
      if(usualRequestBody.repository != undefined ) usualObject ={ ...usualObject, repository: repository}
      if(usualRequestBody.startDate != undefined ) usualObject ={ ...usualObject, startDate: startDate}
      if(usualRequestBody.endDate != undefined ) usualObject ={ ...usualObject, endDate: endDate}
      if(usualRequestBody.developerId != undefined ) usualObject ={ ...usualObject, developerId: developerId}


     usualObject


      

    const query : string = format( `
    UPDATE
        projects pro
    SET
        (%I) = ROW(%L)
    WHERE 
        pro.id = $1
    RETURNING 
        *;
    `
     ,Object.keys(usualObject), Object.values(usualObject))

     const queryConfig : QueryConfig = {
      text: query,
      values: [idRequest]

     }

    const queryResult = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows) 
}


export const deleteProjectsById = async (request : Request , response : Response) : Promise<Response> => {

  const idRequest = request.params.id

  const query =`

  DELETE FROM projects
  WHERE projects.id = $1

  
  `
  const queryConfig : QueryConfig = {
      text: query,
      values : [idRequest] 
  }

  await client.query(queryConfig)

  return response.status(204).json()
}

export const getProjectsOfDeveloperById = async (request : Request , response : Response) : Promise<Response> => {

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
      pro."developerId" = $1 ;
  `

  const queryConfig : QueryConfig = {
      text:query,
      values:[idRequest]
  }

  const queryResult = await client.query(queryConfig)

  return response.status(200).json(queryResult.rows) 
}


export const addTechnologiesToProjects = async (request : Request , response : Response) : Promise<Response> => {

  const idRequest = request.params.id
   const keyRequest = {name : request.body.name }


  const queryValuesPossible : string = `
      SELECT 
          *
      FROM 
          technologies tec
      WHERE 
          tec."technologyName" = $1;
          
  `
 
  const queryConfigValuesPossible : QueryConfig = {
      text:queryValuesPossible,
      values:[ keyRequest.name]
  }

  const queryResultValuesPossible = await client.query(queryConfigValuesPossible)

  if(queryResultValuesPossible.rowCount === 0) return response.status(400).json({"message": "Technology not supported.","options": ["JavaScript","Python","React","Express.js","HTML","CSS","Django","PostgreSQL", "MongoDB"]})


  let tecnologieId = queryResultValuesPossible.rows[0].id



  const queryUpdate : string = `
    UPDATE
        projects_technologies protec
    SET
        ("technologyId") =  ROW($1)
    WHERE 
        protec."projectsId" = $2
    RETURNING 
        *
    `


     const queryConfigUpdate : QueryConfig = {
      text: queryUpdate,
      values: [tecnologieId,idRequest]

     }

     await client.query(queryConfigUpdate)

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

    


  
  return response.status(200).json(queryResult.rows) 
}




export const deleteTecnologieFromProjectByName = async (request : Request , response : Response) : Promise<Response> => {

    const idRequest = request.params.id
    const nameRequest = request.params.name

    const queryIdOfName : string =`

    SELECT 
        *
    FROM 
        technologies tec
    WHERE 
        tec."technologyName" = $1;

    
    `

   const  queryConfigIdOfName : QueryConfig = {
    text : queryIdOfName,
    values: [nameRequest]

   }

   const queryResultIdOfName  = await client.query(queryConfigIdOfName)

   if(queryResultIdOfName.rowCount === 0) return response.status(400).json({"message": "Technology not supported.","options": ["JavaScript","Python","React","Express.js","HTML","CSS","Django","PostgreSQL", "MongoDB"]})

   let tecnologieId  = queryResultIdOfName.rows[0].id 

    const query:string = `

        SELECT 
            *
        FROM 
           Projects_technologies 
         WHERE
         Projects_technologies."projectsId" = $1 AND Projects_technologies."technologyId" =$2

    `

     const queryConfig: QueryConfig ={
         text: query,
         values: [idRequest,tecnologieId]
    }


    const queryResult= await client.query( queryConfig)


    if(queryResult.rows.length === 0 ){
        return response.status(400).json({ message: `Technology '${nameRequest}' not found on this Project.`})
    }

    const queryDelete: string = `
    
    DELETE FROM projects_technologies
    WHERE projects_technologies.id = $1  AND projects_technologies."technologyId" = $2;
    
    `
    
    const queryConfigDelete: QueryConfig ={
        text:queryDelete,
        values:[idRequest,tecnologieId]
    }
    
    await client.query(queryConfigDelete) 
    console.log("ola")


    return response.status(200).json(queryResult.rows)
}

