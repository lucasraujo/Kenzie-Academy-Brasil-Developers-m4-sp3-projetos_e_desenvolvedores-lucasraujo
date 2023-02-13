CREATE TYPE os AS ENUM ('Windows', 'Linux' , 'MacOS');
CREATE TABLE developer_infos(  
    id BIGSERIAL NOT NULL PRIMARY KEY,
    create_time DATE NOT NULL,
    preferredOS OS NOT NULL
);

CREATE TABLE developers(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE projects(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    estimatedTime VARCHAR(20) NOT NULL,
    repository VARCHAR(120) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE
);



CREATE TABLE technologies(
    id BIGSERIAL NOT NULL PRIMARY KEY ,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE projects_technologies(
    id BIGSERIAL NOT NULL PRIMARY KEY ,
    addedIn DATE NOT NULL
);

ALTER TABLE developers ADD COLUMN developer_infosid INTEGER UNIQUE;
ALTER TABLE developers ADD CONSTRAINT teste FOREIGN KEY ("developer_infosid") REFERENCES developer_infos("id");
ALTER TABLE developer_infos RENAME COLUMN developersince TO "developerSince";
ALTER TABLE developer_infos RENAME COLUMN preferredos TO "preferredOS";
ALTER TABLE developers ADD CONSTRAINT addOnDeleteCascade FOREIGN KEY ("developer_infosid") REFERENCES developer_infos("id") ON DELETE CASCADE;
ALTER TABLE developer_infos DROP COLUMN developerid;
ALTER TABLE developer_infos ADD COLUMN developerid INTEGER UNIQUE ;
ALTER TABLE developer_infos ADD CONSTRAINT FK_DEV FOREIGN KEY ("developerid") REFERENCES developers("id") ON DELETE CASCADE;
ALTER TABLE projects ADD COLUMN developerId INTEGER;
ALTER TABLE projects ADD CONSTRAINT projectsDeveloper FOREIGN KEY ("developerid") REFERENCES developers("id");

ALTER TABLE projects_technologies ADD COLUMN projectsId INTEGER;
ALTER TABLE projects_technologies ADD COLUMN technologieId INTEGER;
ALTER TABLE projects_technologies ADD CONSTRAINT FK_TEC FOREIGN KEY ("projectsid") REFERENCES projects("id");
ALTER TABLE projects_technologies ADD CONSTRAINT FK_pro FOREIGN KEY ("technologieid") REFERENCES technologies("id");

 ALTER TABLE projects RENAME COLUMN estimatedtime TO "estimatedTime";
 ALTER TABLE projects RENAME COLUMN startdate TO "startDate";
 ALTER TABLE projects RENAME COLUMN enddate TO "endDate";
 ALTER TABLE projects RENAME COLUMN developerid TO "developerId";

 ALTER TABLE technologies RENAME COLUMN "name" TO "technologyName";

 ALTER TABLE projects_technologies RENAME COLUMN "addedin" TO "addedIn";
 ALTER TABLE projects_technologies RENAME COLUMN "projectsid" TO "projectsId";
 ALTER TABLE projects_technologies RENAME COLUMN "technologieid" TO "technologyId";

DELETE FROM projects_technologies WHERE projects_technologies.id = 2  AND projects_technologies."technologyId" = 7;