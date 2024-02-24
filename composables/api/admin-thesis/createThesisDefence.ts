import { ErrorRoot } from "~~/types/api/error";
import { CreateThesisDefenceRequest, CreateThesisDefenceRoot } from "~~/types/api/thesis/CreateThesisDefence";
import { convertDateWithoutTimeToTimezoned } from "~~/utils/helpers/date-utils";

export async function createThesisDefence(body: CreateThesisDefenceRequest)
    : Promise<{ response: CreateThesisDefenceRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateThesisDefenceRoot>(() => `/api/v1/admin/thesis/admin_thesis.AdminThesisHandler/CreateThesisDefense`, <any>{
            method: 'POST',
            body: {
                thesis_id: req.thesis_id,
                plan_date: convertDateWithoutTimeToTimezoned(req.plan_date),
                plan_start_time: parseFloat(req.plan_start_time.split(':')[0] + req.plan_start_time.split(':')[1]),
                plan_end_time: parseFloat(req.plan_end_time.split(':')[0] + req.plan_end_time.split(':')[1]),
                room_id: req.room_id,
                examiners: req.examiners,
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