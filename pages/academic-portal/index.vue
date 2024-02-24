<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import moment from 'moment';
// import { loginAs } from '@/_mockApis/constant';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import AnnouncementHome from '@/components/shared/academic-portal/AnnouncementHome.vue';
import VirtualClassesHome from '@/components/shared/academic-portal/VirtualClassesHome.vue';
import FileSharingHome from '@/components/shared/academic-portal/FileSharingHome.vue';
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { topCardsAcademic } from '@/types/components/dashboard/modernDashboard';


import card_icon1 from "/images/svgs/icon-user-male.svg"
import card_icon2 from "/images/svgs/icon-briefcase.svg"
import card_icon3 from "/images/svgs/icon-mailbox.svg"
import card_icon4 from "/images/svgs/icon-favorites.svg"
import card_icon5 from "/images/svgs/icon-speech-bubble.svg"
import card_icon6 from "/images/svgs/icon-connect.svg"
import { announcement, announcementItem, virtualClass, virtualClassItem } from '~~/types/academic-portal/homeTypes';

import { GetSharedFileListData as GetLecturerSharedFileListData } from '~~/types/api/share-file-lecturer/GetSharedFileList';
import { getSharedFileList as getLecturerSharedFileList } from '~~/composables/api/share-file-lecturer/getSharedFileList';
import { GetSharedFileListData as GetStudentSharedFileListData } from '~~/types/api/share-file-student/GetSharedFileList';
import { getSharedFileList as getStudentSharedFileList } from '~~/composables/api/share-file-student/getSharedFileList';


import { GetHomePageSemesterSummaryData as GetLecturerSemesterSummaryData } from '~~/types/api/general-lecturer/GetHomePageSemesterSummary';
import { getHomePageSemesterSummary as getLecturerSemesterSummary } from '~~/composables/api/general-lecturer/getHomePageSemesterSummary';
import { GetHomePageSemesterSummaryData as GetStudentSemesterSummaryData } from '~~/types/api/general-student/GetHomePageSemesterSummary';
import { getHomePageSemesterSummary as getStudentSemesterSummary } from '~~/composables/api/general-student/getHomePageSemesterSummary';

import { ErrorRoot } from '~~/types/api/error';
import { LoginData } from '~~/types/api/auth/Login';
import { GetLecturerAnnouncementListData } from '~~/types/api/lecturer-announcement/GetLecturerAnnouncementList';
import { getLecturerAnnouncementList } from '~~/composables/api/lecturer-announcement/getLecturerAnnouncementList';
import { getStudentAnnouncementList } from '~~/composables/api/student-announcement/getStudentAnnouncementList';
import { GetStudentAnnouncementListData } from '~~/types/api/student-announcement/GetStudentAnnouncementList';
import { getLecturerClassWorkList } from '~~/composables/api/lecturer-class-work/getLecturerClassWorkList';
import { GetLecturerClassWorkListData } from '~~/types/api/lecturer-class-work/GetLecturerClassWorkList';
import { GetStudentClassWorkListData } from '~~/types/api/student-class-work/GetStudentClassWorkList';
import { getStudentClassWorkList } from '~~/composables/api/student-class-work/getStudentClassWorkList';
import { getLecturerClassExamList } from '~~/composables/api/lecturer-class-exam/getLecturerClassExamList';
import { getStudentClassExamList } from '~~/composables/api/student-class-exam/getStudentClassExamList';
import { GetLecturerClassExamListData } from '~~/types/api/lecturer-class-exam/GetLecturerClassExamList';
import { GetStudentClassExamListData } from '~~/types/api/student-class-exam/GetStudentClassExamList';
import { getLecturerClassMaterialList } from '~~/composables/api/lecturer-class-material/getLecturerClassMaterialList';
import { getStudentClassMaterialList } from '~~/composables/api/student-class-material/getStudentClassMaterialList';
import { GetLecturerClassMaterialListData } from '~~/types/api/lecturer-class-material/GetLecturerClassMaterialList';
import { GetStudentClassMaterialListData } from '~~/types/api/student-class-material/GetStudentClassMaterialList';


definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
/*Call Components*/
let userData: LoginData = <LoginData>{};
onMounted(async () => {
  const user = useAuth()
  if (user.value) {
    userData = <LoginData>user.value;
    if (userData.app_type == "lecturer") {

      await lecturerMounted()
    } else if (userData.app_type == "student") {
      await studentMounted()
    }
    topCards.value = userData.app_type == "lecturer" ? topCardsLectures.value : userData.app_type == "student" ? topCardsStudents.value : <topCardsAcademic[]>[];
  } else {
    return navigateTo({ name: 'login', path: '' })
  }

})
const page = ref({ title: 'Halaman Utama' });
const breadcrumbs = ref([
  {
    text: 'Home',
    disabled: false,
    href: '/academic-portal'
  },
  {
    text: 'Halaman Utama',
    disabled: true,
    href: '#'
  }
]);

async function lecturerMounted() {
  await getLecturerHomePageSemesterSummaryData()
  await getLecturerSharedFileListData()
  await getLecturerAnnouncementData('academic_information')
  await getLecturerAnnouncementData('student_activity')
  await getLecturerAnnouncementData('registration')
  await getLecturerAnnouncementData('event')
  await getLecturerClassMaterialData()
  await getLecturerClassWorkData()
  await getLecturerClassExamData()
}

async function studentMounted() {
  await getStudentHomePageSemesterSummaryData()
  await getStudentSharedFileListData()
  await getStudentAnnouncementData('academic_information')
  await getStudentAnnouncementData('student_activity')
  await getStudentAnnouncementData('registration')
  await getStudentAnnouncementData('event')
  await getStudentClassMaterialData()
  await getStudentClassWorkData()
  await getStudentClassExamData()
}

const getLecturerHomePageSemesterSummarys = ref(<GetLecturerSemesterSummaryData>{})
async function getLecturerHomePageSemesterSummaryData() {
  try {
    const { response: resp, error: error } = await getLecturerSemesterSummary()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      getLecturerHomePageSemesterSummarys.value = resp?.data
      topCardsLectures.value.forEach(tcl => {
        if (tcl.title == "Periode Persetujuan KRS") {
          tcl.from = new Date(getLecturerHomePageSemesterSummarys.value.study_plan_approval_start_date.substring(0, 10))
          tcl.to = new Date(getLecturerHomePageSemesterSummarys.value.study_plan_approval_end_date.substring(0, 10))
        }
        if (tcl.title == "Jumlah Mahasiswa") {
          tcl.number = getLecturerHomePageSemesterSummarys.value.academic_guidance_total_student.toString()
        }
        if (tcl.title == "Jumlah Kelas") {
          tcl.number = getLecturerHomePageSemesterSummarys.value.total_class.toString()
        }
        if (tcl.title == "Periode Input Nilai") {
          if (getLecturerHomePageSemesterSummarys.value.grading_start_date && getLecturerHomePageSemesterSummarys.value.grading_end_date) {
            tcl.from = new Date(getLecturerHomePageSemesterSummarys.value.grading_start_date.substring(0, 10))
            tcl.to = new Date(getLecturerHomePageSemesterSummarys.value.grading_end_date.substring(0, 10))
          }
        }
      });
    }
  } catch (error) {
    alert(error)
  }
}

const getStudentHomePageSemesterSummarys = ref(<GetStudentSemesterSummaryData>{})
async function getStudentHomePageSemesterSummaryData() {
  try {
    const { response: resp, error: error } = await getStudentSemesterSummary()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      getStudentHomePageSemesterSummarys.value = resp?.data
      topCardsStudents.value.forEach(tcl => {
        if (tcl.title == "Status Akademik") {
          tcl.desc == getStudentHomePageSemesterSummarys.value.status
        }
        if (tcl.title == "Status Bayar") {
          tcl.desc = getStudentHomePageSemesterSummarys.value.has_paid ? "Lunas" : "Belum Lunas"
        }
        if (tcl.title == "Dosen PA") {
          tcl.desc = getStudentHomePageSemesterSummarys.value.academic_guidance_lecturer_name
        }
        if (tcl.title == "Jatah SKS") {
          tcl.number = getStudentHomePageSemesterSummarys.value.maximum_credit.toString()
        }
        if (tcl.title == "Total SKS") {
          tcl.number = (getStudentHomePageSemesterSummarys.value.total_mandatory_credit_taken + getStudentHomePageSemesterSummarys.value.total_optional_credit_taken).toString()
        }
        if (tcl.title == "IP Komulatif") {
          tcl.number = getStudentHomePageSemesterSummarys.value.gpa.toString()
        }
        if (tcl.title == "Periode KRS") {
          if (getStudentHomePageSemesterSummarys.value.study_plan_input_start_date && getStudentHomePageSemesterSummarys.value.study_plan_input_end_date) {
            tcl.from = new Date(getStudentHomePageSemesterSummarys.value.study_plan_input_start_date.substring(0, 10))
            tcl.to = new Date(getStudentHomePageSemesterSummarys.value.study_plan_input_end_date.substring(0, 10))
          }
        }
        if (tcl.title == "Periode Revisi KRS") {
          if (getStudentHomePageSemesterSummarys.value.study_plan_approval_start_date && getStudentHomePageSemesterSummarys.value.study_plan_approval_end_date) {
            tcl.from = new Date(getStudentHomePageSemesterSummarys.value.study_plan_approval_start_date.substring(0, 10))
            tcl.to = new Date(getStudentHomePageSemesterSummarys.value.study_plan_approval_end_date.substring(0, 10))
          }
        }
      });
    }
  } catch (error) {
    alert(error)
  }
}


const getLecturerSharedFileLists = ref(<GetLecturerSharedFileListData[]>[])
async function getLecturerSharedFileListData() {
  try {
    const { response: resp, error: error } = await getLecturerSharedFileList(5, 1, "")
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      getLecturerSharedFileLists.value = resp?.data
      let temp = <any[]>[];
      let colors = <string[]>[
        "#59c4e4",
        "#0aa699",
        "#9aa2a6",
        "#fbb05e",
        "#f35958",
      ];
      let colorIndex = 0;
      getLecturerSharedFileLists.value.forEach((f, index) => {
        if (index % colors.length == 0) {
          colorIndex = 0
        }
        let d = {
          title: f.title,
          link: f.file_url,
          color: colors[colorIndex]
        };
        colorIndex++
        temp.push(d)
      });
      fileSharings.value = temp
    }
  } catch (error) {
    alert(error)
  }
}


const getStudentSharedFileLists = ref(<GetStudentSharedFileListData[]>[])
async function getStudentSharedFileListData() {
  try {
    const { response: resp, error: error } = await getStudentSharedFileList(5, 1, "")
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      getStudentSharedFileLists.value = resp?.data
      let temp = <any[]>[];
      let colors = <string[]>[
        "#59c4e4",
        "#0aa699",
        "#9aa2a6",
        "#fbb05e",
        "#f35958",
      ];
      let colorIndex = 0;
      getStudentSharedFileLists.value.forEach((f, index) => {
        if (index % colors.length == 0) {
          colorIndex = 0
        }
        let d = {
          title: f.title,
          link: f.file_url,
          color: colors[colorIndex]
        };
        colorIndex++
        temp.push(d)
      });
      fileSharings.value = temp
    }
  } catch (error) {
    alert(error)
  }
}

const lecturerAnnouncementAcademicInfos = ref<GetLecturerAnnouncementListData[]>([])
const lecturerAnnouncementStudentActivitys = ref<GetLecturerAnnouncementListData[]>([])
const lecturerAnnouncementRegistrations = ref<GetLecturerAnnouncementListData[]>([])
const lecturerAnnouncementEvents = ref<GetLecturerAnnouncementListData[]>([])
async function getLecturerAnnouncementData(type: string) {
  try {
    const { response: resp, error: error } = await getLecturerAnnouncementList(2, 1, '', type)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      switch (type) {
        case 'academic_information':
          lecturerAnnouncementAcademicInfos.value = resp?.data
          var items: announcementItem[] = []
          resp?.data.forEach(a => {
            items.push(<announcementItem>{
              date: new Date(a.announcement_date),
              link: a.file_url,
              title: a.title,
              desc: a.content,
            })
          });
          announcements.value.push(<announcement>{
            title: 'Kategori: Informasi Akademik',
            items: items
          })
          break;
        case 'student_activity':
          lecturerAnnouncementStudentActivitys.value = resp?.data
          var items: announcementItem[] = []
          resp?.data.forEach(a => {
            items.push(<announcementItem>{
              date: new Date(a.announcement_date),
              link: a.file_url,
              title: a.title,
              desc: a.content,
            })
          });
          announcements.value.push(<announcement>{
            title: 'Kategori: Kegiatan Mahasiswa',
            items: items
          })
          break;
        case 'registration':
          lecturerAnnouncementRegistrations.value = resp?.data
          var items: announcementItem[] = []
          resp?.data.forEach(a => {
            items.push(<announcementItem>{
              date: new Date(a.announcement_date),
              link: a.file_url,
              title: a.title,
              desc: a.content,
            })
          });
          announcements.value.push(<announcement>{
            title: 'Kategori: Seputar Registrasi',
            items: items
          })
          break;
        case 'event':
          lecturerAnnouncementEvents.value = resp?.data
          var items: announcementItem[] = []
          resp?.data.forEach(a => {
            items.push(<announcementItem>{
              date: new Date(a.announcement_date),
              link: a.file_url,
              title: a.title,
              desc: a.content,
            })
          });
          announcements.value.push(<announcement>{
            title: 'Kategori: Event',
            items: items
          })
          break;
        default:
          break;
      }
    }
  } catch (error) {
    alert(error)
  }
}

const studentAnnouncementAcademicInfos = ref<GetStudentAnnouncementListData[]>([])
const studentAnnouncementStudentActivitys = ref<GetStudentAnnouncementListData[]>([])
const studentAnnouncementRegistrations = ref<GetStudentAnnouncementListData[]>([])
const studentAnnouncementEvents = ref<GetStudentAnnouncementListData[]>([])
async function getStudentAnnouncementData(type: string) {
  try {
    const { response: resp, error: error } = await getStudentAnnouncementList(2, 1, '', type)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      switch (type) {
        case 'academic_information':
          studentAnnouncementAcademicInfos.value = resp?.data
          var items: announcementItem[] = []
          resp?.data.forEach(a => {
            items.push(<announcementItem>{
              date: new Date(a.announcement_date),
              link: a.file_url,
              title: a.title,
              desc: a.content,
            })
          });
          announcements.value.push(<announcement>{
            title: 'Kategori: Informasi Akademik',
            items: items
          })
          break;
        case 'student_activity':
          studentAnnouncementStudentActivitys.value = resp?.data
          var items: announcementItem[] = []
          resp?.data.forEach(a => {
            items.push(<announcementItem>{
              date: new Date(a.announcement_date),
              link: a.file_url,
              title: a.title,
              desc: a.content,
            })
          });
          announcements.value.push(<announcement>{
            title: 'Kategori: Kegiatan Mahasiswa',
            items: items
          })
          break;
        case 'registration':
          studentAnnouncementRegistrations.value = resp?.data
          var items: announcementItem[] = []
          resp?.data.forEach(a => {
            items.push(<announcementItem>{
              date: new Date(a.announcement_date),
              link: a.file_url,
              title: a.title,
              desc: a.content,
            })
          });
          announcements.value.push(<announcement>{
            title: 'Kategori: Seputar Registrasi',
            items: items
          })
          break;
        case 'event':
          studentAnnouncementEvents.value = resp?.data
          var items: announcementItem[] = []
          resp?.data.forEach(a => {
            items.push(<announcementItem>{
              date: new Date(a.announcement_date),
              link: a.file_url,
              title: a.title,
              desc: a.content,
            })
          });
          announcements.value.push(<announcement>{
            title: 'Kategori: Event',
            items: items
          })
          break;
        default:
          break;
      }
    }
  } catch (error) {
    alert(error)
  }
}

const lecturerClassWorks = ref<GetLecturerClassWorkListData[]>([])
async function getLecturerClassWorkData() {
  try {
    const { response: resp, error: error } = await getLecturerClassWorkList(2, 1, '', '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerClassWorks.value = resp?.data
      var items: virtualClassItem[] = []
      resp?.data.forEach(a => {
        items.push(<virtualClassItem>{
          date: new Date(a.end_time),
          link: a.file_url,
          title: a.title,
          desc: a.abstraction,
        })
      });
      virtualClasses.value.push(<virtualClass>{
        title: 'Tugas Kuliah',
        items: items
      })
    }
  } catch (error) {
    alert(error)
  }
}

const studentClassWorks = ref<GetStudentClassWorkListData[]>([])
async function getStudentClassWorkData() {
  try {
    const { response: resp, error: error } = await getStudentClassWorkList(2, 1, '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentClassWorks.value = resp?.data
      var items: virtualClassItem[] = []
      resp?.data.forEach(a => {
        items.push(<virtualClassItem>{
          date: new Date(a.end_time),
          link: a.file_url,
          title: a.title,
          desc: a.abstraction,
        })
      });
      virtualClasses.value.push(<virtualClass>{
        title: 'Tugas Kuliah',
        items: items
      })
    }
  } catch (error) {
    alert(error)
  }
}

const lecturerClassExams = ref<GetLecturerClassExamListData[]>([])
async function getLecturerClassExamData() {
  try {
    const { response: resp, error: error } = await getLecturerClassExamList(2, 1, '', '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerClassExams.value = resp?.data
      var items: virtualClassItem[] = []
      resp?.data.forEach(a => {
        items.push(<virtualClassItem>{
          date: new Date(a.end_time),
          link: a.file_url,
          title: a.title,
          desc: a.abstraction,
        })
      });
      virtualClasses.value.push(<virtualClass>{
        title: 'Ujian Kelas',
        items: items
      })
    }
  } catch (error) {
    alert(error)
  }
}

const studentClassExams = ref<GetStudentClassExamListData[]>([])
async function getStudentClassExamData() {
  try {
    const { response: resp, error: error } = await getStudentClassExamList(2, 1, '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentClassExams.value = resp?.data
      var items: virtualClassItem[] = []
      resp?.data.forEach(a => {
        items.push(<virtualClassItem>{
          date: new Date(a.end_time),
          link: a.file_url,
          title: a.title,
          desc: a.abstraction,
        })
      });
      virtualClasses.value.push(<virtualClass>{
        title: 'Ujian Kelas',
        items: items
      })
    }
  } catch (error) {
    alert(error)
  }
}


const lecturerClassMaterials = ref<GetLecturerClassMaterialListData[]>([])
async function getLecturerClassMaterialData() {
  try {
    const { response: resp, error: error } = await getLecturerClassMaterialList(2, 1, '', '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerClassMaterials.value = resp?.data
      var items: virtualClassItem[] = []
      resp?.data.forEach(a => {
        items.push(<virtualClassItem>{
          date: new Date(a.created_at),
          link: a.file_url,
          title: a.title,
          desc: a.abstraction,
        })
      });
      virtualClasses.value.push(<virtualClass>{
        title: 'Materi Kuliah',
        items: items
      })
    }
  } catch (error) {
    alert(error)
  }
}

const studentClassMaterials = ref<GetStudentClassMaterialListData[]>([])
async function getStudentClassMaterialData() {
  try {
    const { response: resp, error: error } = await getStudentClassMaterialList(2, 1, '', '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentClassMaterials.value = resp?.data
      var items: virtualClassItem[] = []
      resp?.data.forEach(a => {
        items.push(<virtualClassItem>{
          date: new Date(a.created_at),
          link: a.file_url,
          title: a.title,
          desc: a.abstraction,
        })
      });
      virtualClasses.value.push(<virtualClass>{
        title: 'Materi kuliah',
        items: items
      })
    }
  } catch (error) {
    alert(error)
  }
}

const topCardsLectures = ref(<topCardsAcademic[]>[
  {
    link: "#",
    img: card_icon3,
    title: "Periode Persetujuan KRS",
    subTitle: "",
    bgcolor: "lightsecondary",
    textcolor: "secondary",
    // from: new Date(),
    // to: new Date(),
  },
  {
    link: "#",
    img: card_icon2,
    title: "Periode Input Nilai",
    subTitle: "",
    bgcolor: "lightwarning",
    textcolor: "warning",
    // from: new Date(),
    // to: new Date(),
  },
  {
    link: "#",
    img: card_icon1,
    title: "Jumlah Mahasiswa",
    subTitle: "Bimbingan Akademik",
    // number: "250",
    bgcolor: "lightprimary",
    textcolor: "primary"
  },
  {
    link: "#",
    img: card_icon4,
    title: "Jumlah Kelas",
    subTitle: "Mata Kuliah Diampu  ",
    // number: "25",
    bgcolor: "lighterror",
    textcolor: "error"
  },
])
const topCardsStudents = ref(<topCardsAcademic[]>[
  {
    link: "#",
    img: card_icon3,
    title: "Status Akademik",
    subTitle: "",
    bgcolor: "lightsecondary",
    textcolor: "secondary",
    desc: "",
  },
  {
    link: "#",
    img: card_icon2,
    title: "Status Bayar",
    subTitle: "",
    bgcolor: "lightwarning",
    textcolor: "warning",
    desc: "",
  },
  {
    link: "#",
    img: card_icon1,
    title: "Dosen PA",
    subTitle: "",
    bgcolor: "lightprimary",
    textcolor: "primary",
    desc: ""

  },
  {
    link: "#",
    img: card_icon4,
    title: "Jatah SKS",
    subTitle: "",
    number: "",
    bgcolor: "lighterror",
    textcolor: "error"
  },

  {
    link: "#",
    img: card_icon4,
    title: "Periode KRS",
    subTitle: "",
    bgcolor: "lighterror",
    textcolor: "error",
    from: '',
    to: '',
  },
  {
    link: "#",
    img: card_icon1,
    title: "Periode Revisi KRS",
    subTitle: "",
    bgcolor: "lightprimary",
    textcolor: "primary",
    from: '',
    to: '',
  },
  {
    link: "#",
    img: card_icon2,
    title: "Total SKS",
    subTitle: "Yang sudah ditempuh",
    bgcolor: "lightwarning",
    textcolor: "warning",
    number: "",
  },
  {
    link: "#",
    img: card_icon3,
    title: "IP Komulatif",
    subTitle: "",
    bgcolor: "lightsecondary",
    textcolor: "secondary",
    number: "",
  },
])
const announcements = ref(<announcement[]>[])

const virtualClasses = ref(<virtualClass[]>[])
const fileSharings = ref(<any[]>[
  // {
  //   title: "Kontrak Kuliah MEKTEK II_Kelas B-TKBA22",
  //   link: "#",
  //   color: "#59c4e4",
  // },
  // {
  //   title: "PEDOMAN GEOMETRY JALAN",
  //   link: "#",
  //   color: "#0aa699",
  // },
  // {
  //   title: "PEDOMAN SURVAI LALU LINTAS",
  //   link: "#",
  //   color: "#9aa2a6",
  // },
  // {
  //   title: "PERMEN PU NO 19 TAHUN 2011",
  //   link: "#",
  //   color: "#fbb05e",
  // },
  // {
  //   title: "UU NO 2 TAHUN 2022",
  //   link: "#",
  //   color: "#f35958",
  // },
])
var topCards = ref(<topCardsAcademic[]>[])
</script>
<style>
.center-item {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
<template>
  <div>
    <v-row>
      <v-col cols="12">
        <AcademicBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row>
          <v-col cols="12" lg="3" md="4" sm="12" v-for="card in <topCardsAcademic[]>topCards" :key="card.title">
            <NuxtLink :to="card.link" style="height:100px"
              :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-' + card.bgcolor">
              <v-row>
                <v-col cols="2">
                  <div style="position: relative;height: 100px;">

                    <img class="center-item" :src="card.img" alt="icon" style="height: 40px;" />
                  </div>
                </v-col>
                <v-col cols="10" style="text-align: right;">
                  <div :class="'text-title text-capitalize font-weight-bold text-' + card.textcolor" v-text="card.title">
                  </div>
                  <div v-if="card.subTitle" :class="'font-italic text-subtitle text-' + card.textcolor"
                    v-text="card.subTitle"></div>

                  <h6 v-if="card.number" :class="'text-h6 mt-1 text-' + card.textcolor" v-text="card.number"></h6>
                  <h6 v-if="card.from" :class="'text-h6 mt-1 text-' + card.textcolor"
                    v-text="moment(card.from).format('DD MMM YYYY')"></h6>
                  <h6 v-if="card.from && card.to" :class="'text-h6 mt-1 text-' + card.textcolor" v-text="'-'"></h6>
                  <h6 v-if="card.to" :class="'text-h6 mt-1 text-' + card.textcolor"
                    v-text="moment(card.to).format('DD MMM YYYY')"></h6>

                  <h6 v-if="card.desc" :class="'mt-1 text-' + card.textcolor" v-text="card.desc"></h6>
                </v-col>
              </v-row>
            </NuxtLink>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row>
          <v-col cols="12" lg="4" md="4" sm="12">
            <div class="bg-lightprimary pa-5">
              <h2 class="text-primary">Pengumuman</h2>
              <AnnouncementHome v-for="anc in announcements" :title="anc.title" :items="anc.items"></AnnouncementHome>
            </div>
          </v-col>
          <v-col cols="12" lg="4" md="4" sm="12">
            <div class="bg-lightwarning pa-5">
              <h2 class="text-warning">Virtual Class</h2>
              <VirtualClassesHome v-for="anc in virtualClasses" :title="anc.title" :items="anc.items">
              </VirtualClassesHome>
            </div>
          </v-col>
          <v-col cols="12" lg="4" md="4" sm="12">
            <div class="bg-lightsecondary pa-5">
              <h2 class="text-secondary">File Sharing</h2>
              <FileSharingHome v-for="fs in fileSharings" :title="fs.title" :link="fs.link" :color="fs.color">
              </FileSharingHome>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>