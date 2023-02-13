import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";

export { iRequestBody } from "../interfaces/interfaces";

export const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody = request.body;
  const { name, email, developer_infosid } = requestBody;
  const usualKeys = {
    name: name,
    email: email,
    developer_infosid: developer_infosid,
  };

  const query: string = format(
    `
    INSERT INTO 
        developers (%I)
    VALUES (%L)
    RETURNING *;
   `,
    Object.keys(usualKeys),
    Object.values(usualKeys)
  );

  const queryResult = await client.query(query);

  return response.status(201).json(queryResult.rows[0]);
};

export const getDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const query = `
    
    SELECT 
      de.id, de.name, de.email, de.developer_infosid, di."developerSince", di."preferredOS"
    FROM 
        developers de 
    LEFT JOIN  
        developer_infos di 
    ON
        ( de.developer_infosid = di.id);
    
    `;

  const queryResult = await client.query(query);

  return response.status(200).json(queryResult.rows);
};

export const getDeveloperById = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const idRequest = request.params.id;

  const query = `
    
    SELECT 
        de.id, de.name, de.email, de.developer_infosid, di."developerSince", di."preferredOS"
    FROM 
        developers de 
    LEFT JOIN  
            developer_infos di ON( de.developer_infosid  = di.id)
    WHERE 
            de.id = $1 ;
    `;
  const queryConfig: QueryConfig = {
    text: query,
    values: [idRequest],
  };

  const queryResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows);
};

export const addInfos = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody = request.body;
  const { developerSince, preferredOS } = requestBody;
  const usualKeys = {
    developerSince: developerSince,
    preferredOS: preferredOS,
  };

  const idRequest = request.params.id;

  const query = format(
    `
    INSERT INTO 
       developer_infos (%I)
    VALUES (%L)
    RETURNING *; 

    
    `,
    Object.keys(usualKeys),
    Object.values(usualKeys)
  );

  const queryResult = await client.query(query);

  const idInfos: number = queryResult.rows[0].id;

  const updateQuery: string = `
    
    UPDATE 
    developers
    SET 
    developer_infosid = $1
    WHERE developers.id = $2;
    `;

  const updateQueryConfig: QueryConfig = {
    text: updateQuery,
    values: [idInfos, idRequest],
  };

  await client.query(updateQueryConfig);
  return response.status(201).json(queryResult.rows[0]);
};

export const UpdateDevByID = async (
  request: Request,
  response: Response
): Promise<Response> => {
  interface irequest {
    name?: string | undefined;
    email?: string | undefined;
  }
  const requestBody = request.body;

  if (requestBody.name === undefined && requestBody.email === undefined) {
    return response.status(400).json({
      message: "At least one of those keys must be send.",
      keys: ["name", "email"],
    });
  }
  const { name, email }: irequest = requestBody;

  let usualKeys: irequest = {
    name: name,
    email: email,
  };

  if (name === undefined) {
    usualKeys = {
      email: email,
    };
  }
  if (email === undefined) {
    usualKeys = {
      name: name,
    };
  }

  const idRequest = request.params.id;

  const updateQuery: string = format(
    `
    UPDATE 
    developers
    SET 
    (%I) = ROW(%L)
    WHERE developers.id = $1
    RETURNING *;
    `,
    Object.keys(usualKeys),
    Object.values(usualKeys)
  );

  const updateQueryConfig: QueryConfig = {
    text: updateQuery,
    values: [idRequest],
  };

  const queryRespose = await client.query(updateQueryConfig);

  return response.status(201).json(queryRespose.rows[0]);
};

export const UpdateInfosByID = async (
  request: Request,
  response: Response
): Promise<Response> => {
  interface iRequestInfo {
    preferredOS?: string | undefined;
    developerSince?: string | undefined;
  }
  const requestBody = request.body;

  if (
    requestBody.developerSince === undefined &&
    requestBody.preferredOS === undefined
  ) {
    return response.status(400).json({
      message: "At least one of those keys must be send.",
      keys: ["developerSince", "preferredOS"],
    });
  }
  const { developerSince, preferredOS }: iRequestInfo = requestBody;

  let usualKeys: iRequestInfo = {
    developerSince: developerSince,
    preferredOS: preferredOS,
  };

  if (developerSince === undefined) {
    usualKeys = {
      preferredOS: preferredOS,
    };
  }
  if (preferredOS === undefined) {
    usualKeys = {
      developerSince: developerSince,
    };
  }

  const idRequest = request.params.id;

  const query: string = `
    SELECT 
        *
    FROM 
        developers
    WHERE 
        developers.id = $1;
    

    `;

  const queryConfig: QueryConfig = {
    text: query,
    values: [idRequest],
  };

  const queryResult = await client.query(queryConfig);

  const updateQuery: string = format(
    `
      UPDATE 
      developer_infos
      SET 
        (%I) = ROW(%L)
      WHERE developer_infos.id = $1
      RETURNING *;
      `,
    Object.keys(usualKeys),
    Object.values(usualKeys)
  );

  const updateQueryConfig: QueryConfig = {
    text: updateQuery,
    values: [queryResult.rows[0].developer_infosid],
  };

  const queryRespose = await client.query(updateQueryConfig);

  return response.status(201).json(queryRespose.rows[0]);
};

export const deleteDevByID = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const idRequest = request.params.id;

  const query: string = `
    SELECT 
        *
    FROM 
        developers
    WHERE 
        developers.id = $1;

    `;
  const queryConfig: QueryConfig = {
    text: query,
    values: [idRequest],
  };

  const queryInfos = await client.query(queryConfig)

  const idOfInfos = queryInfos.rows[0].developer_infosid

  const queryDeleteUser : string = `
  
  DELETE FROM developers 
  WHERE developers.id = $1
  `
  const queryConfigDeleteUser: QueryConfig = {
    text: queryDeleteUser,
    values: [idRequest],
  };

  await client.query(queryConfigDeleteUser)

  const queryDeleteInfo : string = `
  
  DELETE FROM developer_infos 
  WHERE developer_infos.id = $1
  `
  const queryConfigDeleteInfo: QueryConfig = {
    text: queryDeleteInfo,
    values: [idOfInfos],
  };

  await client.query(queryConfigDeleteInfo)
  
  return response.status(204).json();
};

