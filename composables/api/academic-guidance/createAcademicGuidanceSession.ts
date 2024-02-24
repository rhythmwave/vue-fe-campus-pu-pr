import { ErrorRoot } from "~~/types/api/error";
import { CreateAcademicGuidanceSessionRequest, CreateAcademicGuidanceSessionRoot } from "~~/types/api/academic-guidance/CreateAcademicGuidanceSession";
import { convertDateWithoutTimeToTimezoned } from '~/utils/helpers/date-utils'

export async function createAcademicGuidanceSession(body: CreateAcademicGuidanceSessionRequest)
    : Promise<{ response: CreateAcademicGuidanceSessionRoot | null, error: ErrorRoot | null }> {
    try {
        if(body.session_date != ''){
            body.session_date = convertDateWithoutTimeToTimezoned(body.session_date)
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateAcademicGuidanceSessionRoot>(() => `/api/v1/admin/lecturer/admin_academic_guidance.AdminAcademicGuidanceHandler/CreateSession`, <any>{
            method: 'POST',
            body: body,
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