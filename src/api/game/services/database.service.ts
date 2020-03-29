import request from "request-promise";
import { IRequestOptions } from "../../../../tests/unit/api/database/interfaces/RequestOptions.interface";
import { DATABASE_API_SERVER } from "@/api/database/constants/database.constants";

class DatabaseService {
  clearAll (modelName: string, body: any = {}) {
    const options: IRequestOptions = this.getRequestOptions(modelName, body);
    return request.delete(options);
  }

  getAll (modelName: string, condition: any = {}) {
    const options = this.getRequestOptions(modelName, condition);
    return request(options);
  }

  create (modelName: string, data: any = {}) {
    const options: IRequestOptions = this.getRequestOptions(modelName, data);
    return request.post(options);
  }

  update (modelName: string, conditionAndData: any = {}) {
    const options: IRequestOptions = this.getRequestOptions(modelName, conditionAndData);
    return request.patch(options);
  }

  getRequestOptions (modelName: string, bodyParameters: any = {}): IRequestOptions {
    const options: IRequestOptions = {
      uri: `${DATABASE_API_SERVER}/${modelName}`,
      json: true,
      body: bodyParameters
    };
    return options;
  }
}

export default new DatabaseService();
