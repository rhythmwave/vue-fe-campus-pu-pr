import { ErrorRoot } from "~~/types/api/error";
import { CreateExamSupervisorRole, CreateExamSupervisorRoleRoot } from "~~/types/api/class-participant/CreateExamSupervisorRole";
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

export async function createExamSupervisorRole(body: CreateExamSupervisorRole)
    : Promise<{ response: CreateExamSupervisorRoleRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateExamSupervisorRoleRoot>(() => `/api/v1/admin/student_class/admin_exam_supervisor_role.AdminExamSupervisorRoleHandler/Create`, <any>{
            method: 'POST',
            body: {
                name: req.name,
                sort: Number(req.sort),
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