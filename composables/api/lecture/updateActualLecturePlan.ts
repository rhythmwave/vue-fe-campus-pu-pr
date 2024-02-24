import { ErrorRoot } from "~~/types/api/error";
import { UpdateActualLecturePlanRoot, UpdateActualLecturePlanRequest, UpdateActualLecturePlanParticipant } from "~~/types/api/lecture/UpdateActualLecturePlan";
import { convertDateWithoutTimeToTimezoned, formatDateNow } from '~~/utils/helpers/date-utils';

export async function updateActualLecturePlan(body: UpdateActualLecturePlanRequest)
    : Promise<{ response: UpdateActualLecturePlanRoot | null, error: ErrorRoot | null }> {
    try {
        let participants = <UpdateActualLecturePlanParticipant[]>[]
        if(body.participants){
            body.participants.forEach(function(item){
                participants.push(item)
            })
        }
        let d = new Date()
        console.log("--------- ")
        console.log(body)
        console.log("--------- ")
        let req = <UpdateActualLecturePlanRequest>{
            id: body.id,
            room_id: body.room_id,
            lecturer_id: body.lecturer_id,
            foreign_lecturer_name: body.foreign_lecturer_name,
            foreign_lecturer_source_instance: body.foreign_lecturer_source_instance,
            lecture_plan_date: body.lecture_plan_date ? convertDateWithoutTimeToTimezoned(body.lecture_plan_date) : '',
            lecture_plan_start_time: body.lecture_plan_start_time,
            lecture_plan_end_time: body.lecture_plan_end_time,
            lecture_actual_date: body.lecture_actual_date ? convertDateWithoutTimeToTimezoned(body.lecture_actual_date) : '',
            lecture_actual_start_time: body.lecture_actual_start_time,
            lecture_actual_end_time: body.lecture_actual_end_time,
            lecture_theme: body.lecture_theme,
            lecture_subject: body.lecture_subject,
            remarks: body.remarks,
            participants: participants,
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateActualLecturePlanRoot>(() => `/api/v1/admin/student_class/admin_lecture.AdminLectureHandler/Update`, <any>{
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
            return { response: null, error: errorRoot };
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}