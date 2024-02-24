import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface AttendAutonomousLectureRequest {
    lecture_id: string
}
  

export interface AttendAutonomousLectureRoot {
    meta: MetaModel
    data: any
}

