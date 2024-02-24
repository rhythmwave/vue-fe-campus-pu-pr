import { MetaModel } from '../meta'

export interface CreateFacultyRequest {
    name: string
    short_name: string
    english_name: string
    english_short_name: string
    address: string
    phone_number: string
    fax: string
    email: string
    contact_person: string
    experiment_building_area: number
    lecture_hall_area: number
    lecture_hall_count: number
    laboratorium_area: number
    laboratorium_count: number
    permanent_lecturer_room_area: number
    administration_room_area: number
    book_count: number
    book_copy_count: number
  }

export interface CreateFacultyRoot {
    meta: MetaModel
    data: any
  }