import { ErrorRoot } from "~~/types/api/error";
import { BulkLecturePlanRequest, BulkLecturePlanRoot } from "~~/types/api/lecture/BulkLecturePlan";
import { convertDateWithoutTimeToTimezoned, formatYearMonthDate } from '~~/utils/helpers/date-utils';

export async function bulkLecture(body: BulkLecturePlanRequest)
    : Promise<{ response: BulkLecturePlanRoot | null, error: ErrorRoot | null }> {
    try {
        // var req = Object.assign({}, body)
        let lecture_plan_dates = <string[]>[]
        body.lecture_plan_dates.forEach(function(item){
            lecture_plan_dates.push(convertDateWithoutTimeToTimezoned(item))
        })
        var req = <BulkLecturePlanRequest>{
            class_id: body.class_id,
            lecture_plan_dates: lecture_plan_dates,
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<BulkLecturePlanRoot>(() => `/api/v1/admin/student_class/admin_lecture.AdminLectureHandler/BulkCreate`, <any>{
            method: 'POST',
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