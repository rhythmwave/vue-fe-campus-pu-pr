import { ErrorRoot } from "~~/types/api/error";
import { UpdateThesisDefenceRequest, UpdateThesisDefenceRoot } from "~~/types/api/thesis/UpdateThesisDefence";
import { convertDateWithoutTimeToTimezoned } from "~~/utils/helpers/date-utils";

export async function updateThesisDefence(body: UpdateThesisDefenceRequest)
    : Promise<{ response: UpdateThesisDefenceRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateThesisDefenceRoot>(() => `/api/v1/admin/thesis/admin_thesis.AdminThesisHandler/UpdateThesisDefense`, <any>{
            method: 'PATCH',
            body: {
                id: body.id,
                plan_date: convertDateWithoutTimeToTimezoned(body.plan_date),
                plan_start_time: parseFloat(body.plan_start_time.split(':')[0] + body.plan_start_time.split(':')[1]),
                plan_end_time: parseFloat(body.plan_end_time.split(':')[0] + body.plan_end_time.split(':')[1]),
                room_id: body.room_id,
                actual_date: convertDateWithoutTimeToTimezoned(body.actual_date),
                actual_start_time: parseFloat(body.actual_start_time.split(':')[0] + body.actual_start_time.split(':')[1]),
                actual_end_time: parseFloat(body.actual_end_time.split(':')[0] + body.actual_end_time.split(':')[1]),
                is_passed: body.is_passed,
                revision: body.revision,
                grade_code: body.grade_code,
                examiners: body.examiners,
            },
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