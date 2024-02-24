import { ErrorRoot } from "~~/types/api/error";
import { UpsertStudentSkpiAchievement, UpsertStudentSkpiCertificate, UpsertStudentSkpiCharacterBuilding, UpsertStudentSkpiLanguage, UpsertStudentSkpiOrganization, UpsertStudentSkpiRequest, UpsertStudentSkpiRoot } from "~~/types/api/student-skpi/UpsertStudentSkpi";

export async function upsertStudentSkpi(body: UpsertStudentSkpiRequest)
    : Promise<{ response: UpsertStudentSkpiRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        var organizations = <UpsertStudentSkpiOrganization[]>[]
        body.organizations.forEach(o => {
            var org = <UpsertStudentSkpiOrganization>{
                name: o.name,
                position: o.position,
                service_length: Number(o.service_length)
            }
            organizations.push(org)
        });
        var achievements = <UpsertStudentSkpiAchievement[]>[]
        body.achievements.forEach(o => {
            var ach = <UpsertStudentSkpiAchievement>{
                name: o.name,
                year: Number(o.year)
            }
            achievements.push(ach)
        });
        var certificates = <UpsertStudentSkpiCertificate[]>[]
        body.certificates.forEach(o => {
            var crt = Object.assign({}, o)
            certificates.push(crt)
        });
        var character_buildings = <UpsertStudentSkpiCharacterBuilding[]>[]
        body.character_buildings.forEach(o => {
            var cb = Object.assign({}, o)
            character_buildings.push(cb)
        });
        var internships = <UpsertStudentSkpiCharacterBuilding[]>[]
        body.internships.forEach(o => {
            var intr = Object.assign({}, o)
            internships.push(intr)
        });
        var languages = <UpsertStudentSkpiCharacterBuilding[]>[]
        body.languages.forEach(o => {
            var lng = Object.assign({}, o)
            languages.push(lng)
        });

        const { data: data, pending, refresh, error } = await useAPIFetch<UpsertStudentSkpiRoot>(() => `/api/v1/student/student_student_skpi.StudentStudentSkpiHandler/Upsert`, <any>{
            method: 'POST',
            body: {
                achievement_path: req.achievement_path,
                achievement_path_type: req.achievement_path_type,
                organization_path: req.organization_path,
                organization_path_type: req.organization_path_type,
                certificate_path: req.certificate_path,
                certificate_path_type: req.certificate_path_type,
                language_path: req.language_path,
                language_path_type: req.language_path_type,
                achievements: achievements,
                organizations: organizations,
                certificates: certificates,
                character_buildings: character_buildings,
                internships: internships,
                languages: languages,
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