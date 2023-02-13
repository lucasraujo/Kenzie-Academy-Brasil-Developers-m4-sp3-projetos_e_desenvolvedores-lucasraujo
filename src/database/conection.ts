import { client } from "./config";



export const startDatabase = async (): Promise<void> => {
    client.connect();
    console.log("Conexão feita.");
  };