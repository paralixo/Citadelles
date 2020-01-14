import request from "request-promise"
import { IRequestOptions } from "../../../../tests/unit/api/database/interfaces/RequestOptions.interface"
import { DATABASE_API_SERVER } from "@/api/database/constants/database.constants"

class DatabaseService {
  clearAll (modelName: string) {
    const options: IRequestOptions = this.getRequestOptions(modelName)
    return request.delete(options)
  }

  getAll (modelName: string, bodyParameters: any = {}) {
    const options = this.getRequestOptions(modelName, bodyParameters)
    return request(options)
  }

  create (modelName: string, bodyParameters: any = {}) {
    const options: IRequestOptions = this.getRequestOptions(modelName, bodyParameters)
    return request.post(options)
  }

  update (modelName: string, bodyParameters: any = {}) {
    const options: IRequestOptions = this.getRequestOptions(modelName, bodyParameters)
    return request.patch(options)
  }

  getRequestOptions (modelName: string, bodyParameters: any = {}): IRequestOptions {
    return {
      uri: `${DATABASE_API_SERVER}/${modelName}`,
      json: true,
      body: bodyParameters
    }
  }
}

export default new DatabaseService()
