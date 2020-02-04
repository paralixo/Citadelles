export const SERVER_HOST: string = "127.0.0.1";
export const SERVER_PORT: string = ":27017";
export const SERVER: string = SERVER_HOST + SERVER_PORT;
export const DATABASE: string = "citadelles";
export const DATABASE_URI: string = `mongodb://${SERVER}/${DATABASE}`;
export const DATABASE_API_PORT: number = 3000;
export const DATABASE_API_SERVER: string = `http://${SERVER_HOST}:${DATABASE_API_PORT}`;
