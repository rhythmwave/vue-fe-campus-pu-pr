import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentLectureDetailRoot {
    meta: MetaModel
    data: GetStudentLectureDetailData
}

export interface GetStudentLectureDetailData {
    id: string,
    name: string,
    age: number,
}
