import { ErrorRoot } from "~~/types/api/error";
import { UpdateLessonPlanRequest, UpdateLessonPlanRoot } from "~~/types/api/lesson-plan/UpdateLessonPlan";

export async function updateLessonPlan(body: UpdateLessonPlanRequest)
    : Promise<{ response: UpdateLessonPlanRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateLessonPlanRoot>(() => `/api/v1/admin/curriculum/admin_lesson_plan.AdminLessonPlanHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                subject_id: req.subject_id,
                meeting_order: Number(req.meeting_order),
                lesson: req.lesson,
                english_lesson: req.english_lesson,
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