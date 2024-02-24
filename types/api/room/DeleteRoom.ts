import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteRoomRequest {
    id: string
}
  

export interface DeleteRoomRoot {
    meta: MetaModel
    data: any
}
