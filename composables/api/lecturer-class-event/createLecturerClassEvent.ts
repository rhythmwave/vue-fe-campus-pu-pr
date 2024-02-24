import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerClassEventRequest, CreateLecturerClassEventRoot } from "~~/types/api/lecturer-class-event/CreateLecturerClassEvent";

export async function createLecturerClassEvent(body: CreateLecturerClassEventRequest)
    : Promise<{ response: CreateLecturerClassEventRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerClassEventRoot>(() => `/api/v1/lecturer/lecturer_class_event.LecturerClassEventHandler/Create`, <any>{
            method: 'POST',
            body: {
                class_id: req.class_id,
                title: req.title,
                frequency: req.frequency,
                event_time: req.event_time,
                remarks: req.remarks,
                is_active: req.is_active,
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