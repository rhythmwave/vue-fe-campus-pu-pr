import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpsertStudentSkpiRequest {
    achievement_path: string
    achievement_path_type: string
    organization_path: string
    organization_path_type: string
    certificate_path: string
    certificate_path_type: string
    language_path: string
    language_path_type: string
    achievements: UpsertStudentSkpiAchievement[]
    organizations: UpsertStudentSkpiOrganization[]
    certificates: UpsertStudentSkpiCertificate[]
    character_buildings: UpsertStudentSkpiCharacterBuilding[]
    internships: UpsertStudentSkpiInternship[]
    languages: UpsertStudentSkpiLanguage[]
  }
  
  export interface UpsertStudentSkpiAchievement {
    name: string
    year: number
  }
  
  export interface UpsertStudentSkpiOrganization {
    name: string
    position: string
    service_length: number
  }
  
  export interface UpsertStudentSkpiCertificate {
    name: string
  }
  
  export interface UpsertStudentSkpiCharacterBuilding {
    name: string
  }
  
  export interface UpsertStudentSkpiInternship {
    name: string
  }
  
  export interface UpsertStudentSkpiLanguage {
    name: string
    score: string
    date: string
  }
  

export interface UpsertStudentSkpiRoot {
    meta: MetaModel
    data: any
}

