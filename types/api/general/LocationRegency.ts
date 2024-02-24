import { MetaModel } from "~~/types/backoffice/backofficeTypes"
import { PaginationModel } from "../pagination"

export interface GetLocationRegencyListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLocationRegencyList[]
}

export interface GetLocationRegencyList {
    id: string
    name: string
}