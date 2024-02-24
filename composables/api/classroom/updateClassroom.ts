import { ErrorRoot } from "~~/types/api/error";
import { EditClassroomRequest } from "~~/types/api/classroom/EditClassroomRequest";
import { LecturerForClassRoom } from '~~/types/api/lecturer/LecturerForClassroom';
import { ResponseInsertClassroom } from "~~/types/api/classroom/ResponseInsertClassroom";
import { convertDateWithoutTimeToTimezoned } from "~~/utils/helpers/date-utils"

export async function updateClassroom(body: EditClassroomRequest)
    : Promise<{ response: ResponseInsertClassroom | null, error: ErrorRoot | null }> {
    try {
        let lecturers = <LecturerForClassRoom[]>[]
        if(body.lecturers.length > 0){
            body.lecturers.forEach(function(item){
                lecturers.push(item)
            })
        }
        let req = <EditClassroomRequest>{
            id: body.id,
            subject_id: body.subject_id,
            semester_id: body.semester_id,
            name: body.name,
            scope: body.scope,
            is_online: body.is_online,
            is_offline: body.is_offline,
            minimum_participant: body.minimum_participant,
            maximum_participant: body.maximum_participant,
            remarks: body.remarks,
            lecturers: lecturers,
            is_mbkm: body.is_mbkm,
            application_deadline: body.application_deadline ? convertDateWithoutTimeToTimezoned(body.application_deadline) : '',
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<ResponseInsertClassroom>(() => `/api/v1/admin/schedule/admin_class.AdminClassHandler/Update`, <any>{
            method: 'PATCH',
            body: req,
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                return { response: null, error: errorRoot };
            }
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return { response: null, error: errorRoot };
            }
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}