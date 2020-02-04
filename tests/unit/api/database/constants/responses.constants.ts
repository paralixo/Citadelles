import { IResponseEdit } from "../interfaces/ResponseEdit.interface";

export const UPDATE_EXPECTED_RESPONSE: IResponseEdit = {
  n: 1,
  nModified: 0,
  ok: 1
};

export const DELETE_EXPECTED_RESPONSE: IResponseEdit = {
  n: 1,
  ok: 1,
  deletedCount: 1
};

/*

create
"data": {
        "_id": "5e14a1b1ba37692b1ca7566c",
        "name": "test bison",
        "image": "imgbison.jpg",
        "description": "desc style",
        "price": 2,
        "type": null,
        "__v": 0
    }
read
"data": [
        {
            "_id": "5e14a218ba37692b1ca7566d",
            "name": "test bison",
            "image": "imgbison.jpg",
            "description": "desc style",
            "price": 2,
            "type": null,
            "__v": 0
        }
    ]
delete
"data": {
        "n": 6,
        "ok": 1,
        "deletedCount": 6
    }
*/
