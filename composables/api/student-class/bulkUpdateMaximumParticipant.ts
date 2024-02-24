import { ErrorRoot } from "~~/types/api/error";
import { BulkUpdateMaximumParticipantDataRequest, BulkUpdateMaximumParticipantRoot, BulkUpdateMaximumParticipantRequest } from "~~/types/api/student-class/BulkUpdateMaximumParticipant";

export async function bulkUpdateMaximumParticipant(body: BulkUpdateMaximumParticipantDataRequest[])
    : Promise<{ response: BulkUpdateMaximumParticipantRoot | null, error: ErrorRoot | null }> {
    try {
        let dataArr = <BulkUpdateMaximumParticipantDataRequest[]>[];
        for (let index = 0; index < body.length; index++) {
            dataArr.push(<BulkUpdateMaximumParticipantDataRequest>{
                class_id: body[index].class_id,
                maximum_participant: Number(body[index].maximum_participant),
            })
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<BulkUpdateMaximumParticipantRoot>(() => `/api/v1/admin/student_class/admin_class.AdminClassHandler/BulkUpdateMaximumParticipant`, <any>{
            method: 'PATCH',
            body: {
                data: dataArr
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