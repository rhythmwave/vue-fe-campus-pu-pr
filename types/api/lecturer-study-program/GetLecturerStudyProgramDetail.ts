import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerStudyProgramDetailRoot {
    meta: MetaModel
    data: GetLecturerStudyProgramDetailData
}

export interface GetLecturerStudyProgramDetailData {
    id: string,
    name: string,
    age: number,
}
