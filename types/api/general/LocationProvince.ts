import { MetaModel } from "~~/types/backoffice/backofficeTypes"
import { PaginationModel } from "../pagination"

export interface GetLocationProvinceListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLocationProvinceList[]
}

export interface GetLocationProvinceList {
    id: string
    name: string
}