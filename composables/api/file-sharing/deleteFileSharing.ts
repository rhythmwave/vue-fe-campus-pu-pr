import { ErrorRoot } from "~~/types/api/error";
import {  DeleteFileSharingRoot } from "~~/types/api/file-sharing/DeleteFileSharing";
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils'

export async function deleteFileSharing(id: string)
    : Promise<{ response: DeleteFileSharingRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteFileSharingRoot>(() => `/api/v1/lecturer/lecturer_shared_file.LecturerSharedFileHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                id: id,
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