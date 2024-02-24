import { ErrorRoot } from "~~/types/api/error";
import { CreateFileRequest, CreateFileRoot } from "~~/types/api/file/CreateFile";

export async function createFile(body: CreateFileRequest)
    : Promise<{ response: CreateFileRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateFileRoot>(() => `/api/v1/general/general_file.GeneralFileHandler/UploadBase64Temp`, <any>{
            method: 'POST',
            body: {
                file: req.file,
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