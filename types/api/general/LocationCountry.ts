import { MetaModel } from "~~/types/backoffice/backofficeTypes"
import { PaginationModel } from "../pagination"

export interface GetLocationCountryListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLocationCountryList[]
}

export interface GetLocationCountryList {
    id: string
    name: string
}