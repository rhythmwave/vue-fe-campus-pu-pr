import { ErrorRoot } from "~~/types/api/error";
import {  CreateFileSharingRequest, CreateFileSharingRoot } from "~~/types/api/file-sharing/CreateFileSharing";
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils'

export async function createFileSharing(body: CreateFileSharingRequest)
    : Promise<{ response: CreateFileSharingRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateFileSharingRoot>(() => `/api/v1/lecturer/lecturer_shared_file.LecturerSharedFileHandler/Create`, <any>{
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