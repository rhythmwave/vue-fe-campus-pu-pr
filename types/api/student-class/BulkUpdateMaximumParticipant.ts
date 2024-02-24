import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface BulkUpdateMaximumParticipantRoot {
    meta: MetaModel
    data: any
}

export interface BulkUpdateMaximumParticipantRequest{
    data: BulkUpdateMaximumParticipantDataRequest[]
}
export interface BulkUpdateMaximumParticipantDataRequest{
    class_id: string
    maximum_participant: number
}