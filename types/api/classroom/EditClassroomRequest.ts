import { LecturerForClassRoom } from '~~/types/api/lecturer/LecturerForClassroom';

export interface EditClassroomRequest {
    id: string
    subject_id: string
    semester_id: string
    name: string
    scope: string
    is_online: boolean
    is_offline: boolean
    minimum_participant: number
    maximum_participant: number
    remarks: string
    lecturers: LecturerForClassRoom[]
    is_mbkm: boolean
    application_deadline: string
}