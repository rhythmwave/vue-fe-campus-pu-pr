import {
  HomeIcon,
  BookIcon,
  LayoutAlignCenterIcon,
  AddressBookIcon,
  FileStarIcon,
  StairsIcon,
  CalendarEventIcon,
  WalletIcon,
  StarsIcon,
  BuildingBankIcon,
  CalendarStatsIcon,
  UsersIcon,
  UserCheckIcon,
  UserSearchIcon,
  RegisteredIcon,
  Book2Icon,
  PlayCardOffIcon,
  BuildingCottageIcon,
  LetterNIcon,
  FolderIcon,
  BuildingArchIcon,
  LockAccessIcon,
  LockIcon,
  Clock2Icon,
  ClockHour12Icon,
} from "vue-tabler-icons";

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

export let permissions = {
  name: 'root',
};
var sidebarItem = ():menu[] =>{
  if(permissions.name == 'root'){
    return [
        {
            title: "Beranda",
            icon: HomeIcon,
            to: "/backoffice",
        },
        {
            title: "Daftar User",
            icon: UsersIcon,
            to: "/root-backoffice/users",
        },
        {
            title: "Daftar Grup",
            icon: LockAccessIcon,
            to: "/root-backoffice/roles",
        },
        {
            title: "Daftar Modul",
            icon: PlayCardOffIcon,
            to: "/root-backoffice/permissions",
        },
        {
            title: "Fakultas",
            icon: BuildingBankIcon,
            to: "/root-backoffice/faculties",
        },
        {
            title: "Jurusan",
            icon: BuildingArchIcon,
            to: "/root-backoffice/majors",
        },
        {
            title: "Program Studi",
            icon: BuildingCottageIcon,
            to: "/root-backoffice/study-programs",
        },
        {
            title: "Ubah Password",
            icon: LockIcon,
            to: "/root-backoffice/change-password",
        },
        {
            title: "Log Aktifitas Backoffice",
            icon: Clock2Icon,
            to: "/root-backoffice/backoffice-activity-histories",
        },
        {
            title: "Log Aktifitas Portal",
            icon: ClockHour12Icon,
            to: "/root-backoffice/portal-activity-histories",
        },
      ];
  }
  
  if(permissions.name == 'admin'){
    return [
      // {
      //   title: "Beranda",
      //   icon: HomeIcon,
      //   to: "/backoffice",
      // },
      {
        title: "Program Studi",
        icon: BookIcon,
        children: [
          {
            title: "Manajemen Program Studi",
            to: "/backoffice/study-program/study-program-management",
          },
          {
            title: "Akreditasi",
            to: "/backoffice/study-program/accreditation",
          },
        ]
      },
      {
        title: "Kurikulum",
        icon: LayoutAlignCenterIcon,
        children: [
          {
            title: "Data Kurikulum",
            to: "/backoffice/curriculum/curriculum-data",
          },
          {
            title: "Mata Kuliah",
            to: "/backoffice/curriculum/course",
          },
          {
            title: "Mata Kuliah Prasyarat",
            to: "/backoffice/curriculum/prerequisite-courses",
          },
          {
            title: "Mata Kuliah Setara",
            to: "/backoffice/curriculum/equivalent-courses",
          },
          {
            title: "Rencana Pembelajaran",
            to: "/backoffice/curriculum/lesson-plan",
          },
          // {
          //   title: "Rencana Evaluasi",
          //   to: "/backoffice/curriculum/evaluation-plan",
          // },
        ]
      },
      {
        title: "Data Referensi",
        icon: AddressBookIcon,
        children: [
          {
            title: "Kategori Mata Kuliah",
            to: "/backoffice/reference-data/course-category",
          },
          {
            title: "Persetujuan File Sharing",
            to: "/backoffice/file-sharing/approval",
          },
          {
            title: "Informasi Akademik",
            to: "/backoffice/academic-information",
          },
          {
            title: "Kelompok Keahlian",
            to: "/backoffice/reference-data/expertise-group",
          },
        ]
      },
      {
        title: "Komponen Nilai",
        icon: FileStarIcon,
        children: [
          {
            title: "Jenis Komponen Nilai",
            to: "/backoffice/value-component/value-component-type",
          },
          {
            title: "Manajemen Komponen Nilai",
            to: "/backoffice/value-component/value-component-management",
          },
          {
            title: "Nilai Mata Kuliah",
            to: "/backoffice/value-component/course-grade",
          },
        ]
      },
      {
        title: "Jenis Nilai",
        icon: StairsIcon,
        children: [
          {
            title: "Manajemen Jenis Nilai",
            to: "/backoffice/value-type/value-type-management",
          },
        ]
      },
      {
        title: "Semester",
        icon: CalendarEventIcon,
        children: [
          // {
          //   title: "Jenis Semester",
          //   to: "/backoffice/semester/semester-type",
          // },
          {
            title: "Setting Semester",
            to: "/backoffice/semester/semester-settings",
          },
          // {
          //   title: "Semester Program Studi",
          //   to: "/backoffice/semester/semester-study-program",
          // },
        ]
      },
      {
        title: "Jatah SKS",
        icon: WalletIcon,
        children: [
          {
            title: "Manajemen Jatah SKS",
            to: "/backoffice/ration-credits/ration-credits-management",
          },
          {
            title: "Setting Semester",
            to: "/backoffice/ration-credits/tolerance-credits",
          },
        ]
      },
      {
        title: "Predikat Kelulusan",
        icon: StarsIcon,
        children: [
          {
            title: "Manajemen Predikat Kelulusan",
            to: "/backoffice/graduation-title/graduation-title-management",
          },
        ]
      },
      {
        title: "Manajemen Ruang",
        icon: BuildingBankIcon,
        children: [
          {
            title: "Manajemen Gedung",
            to: "/backoffice/space-management/building-management",
          },
          {
            title: "Manajemen Ruang/Kelas",
            to: "/backoffice/space-management/room-management",
          },
          {
            title: "Manajemen Laboratorium",
            to: "/backoffice/space-management/lab-management",
          },
          {
            title: "Penggunaan Ruang",
            to: "/backoffice/space-management/space-usage",
          },
        ]
      },
      {
        title: "Jadwal",
        icon: CalendarStatsIcon,
        children: [
          {
            title: "Kelas",
            to: "/backoffice/schedule/classroom",
          },
          // {
          //   title: "Buat Kelas Masal",
          //   to: "/backoffice/schedule/bulk-create-classroom",
          // },
          // {
          //   title: "Copy Kelas",
          //   to: "/backoffice/schedule/classroom-copy",
          // },
          {
            title: "Jadwal Kelas",
            to: "/backoffice/schedule/classroom-schedule",
          },
          {
            title: "Jadwal Ujian",
            to: "/backoffice/schedule/exam-schedule",
          },
          {
            title: "Cetak Jadwal",
            to: "/backoffice/schedule/schedule-print",
          },
        ]
      },
      {
        title: "Dosen",
        icon: UsersIcon,
        children: [
          {
            title: "Data Dosen",
            to: "/backoffice/lecturer/lecturer-data",
          },
          {
            title: "Jadwal Dosen",
            to: "/backoffice/lecturer/lecturer-schedule",
          },
          {
            title: "Mhs. Bimbingan Akd. Per Dosen",
            to: "/backoffice/lecturer/academic-guidance-students-per-lecturer",
          },
          {
            title: "Cuti Dosen",
            to: "/backoffice/lecturer/lecturer-leave",
          },
          // {
          //   title: "Riwayat Cuti Dosen",
          //   to: "/backoffice/lecturer/lecturer-leave-history",
          // },
          {
            title: "Dosen Keluar / Pensiun / Alm.",
            to: "/backoffice/lecturer/lecturer-out-retired",
          },
          // {
          //   title: "Dosen Studi Lanjut",
          //   to: "/backoffice/lecturer/advanced-studies-lecturer",
          // },
          // {
          //   title: "Riwayat Dosen Studi Lanjut",
          //   to: "/backoffice/lecturer/advanced-studies-lecturer-history",
          // },
          {
            title: "Dosen Tugas Ke Instansi Lain",
            to: "/backoffice/lecturer/lecturer-assignments-to-other-agencies",
          },
          // {
          //   title: "Riwayat Tugas Dosen",
          //   to: "/backoffice/lecturer/lecturer-assignments-history",
          // },
          // {
          //   title: "Kuota Dosen",
          //   to: "/backoffice/thesis/lecturer-quota",
          // },
        ]
      },
      {
        title: "Pejabat",
        icon: UserCheckIcon,
        children: [
          {
            title: "Pejabat Pengesah Dokumen",
            to: "/backoffice/official/official-list",
          },
          {
            title: "Proses Pengesahan Dokumen",
            to: "/backoffice/official/validator-officer",
          },
          {
            title: "Tipe Dokumen",
            to: "/backoffice/official/document-validated",
          },
          {
            title: "Dokumen Tipe Pengesah",
            to: "/backoffice/official/validator-type-document",
          },
        ]
      },
      {
        title: "Kemahasiswaan",
        icon: UserSearchIcon,
        children: [
          {
            title: "Mahasiswa",
            to: "/backoffice/student-affairs/student",
          },
          {
            title: "Bimbingan Akademik",
            to: "/backoffice/student-affairs/academic-guidance",
          },
          {
            title: "Pengajuan Cuti Mahasiswa",
            to: "/backoffice/student-affairs/applying-for-student-leave",
          },
          {
            title: "Cuti Mahasiswa",
            to: "/backoffice/student-affairs/student-leave",
          },
          {
            title: "Riwayat Cuti dan Nonaktif Mhs.",
            to: "/backoffice/student-affairs/student-leave-history",
          },
          // {
          //   title: "Mahasiswa Keluar",
          //   to: "/backoffice/student-affairs/student-out",
          // },
          // {
          //   title: "Mahasiswa Drop Out",
          //   to: "/backoffice/student-affairs/student-drop-out",
          // },
          // {
            //   title: "Status Aktif/Nonaktif Mhs.",
            //   to: "/backoffice/student-affairs/student-activation-status",
            // },
          // {
          //   title: "Kurikulum Mahasiswa",
          //   to: "/backoffice/student-affairs/student-curriculum",
          // },
          {
            title: "Rekapitulasi Status Akademik",
            to: "/backoffice/student-affairs/recapitulation-of-academic-status",
          },
        ]
      },
      {
        title: "Status Registrasi",
        icon: RegisteredIcon,
        children: [
          // {
          //   title: "Manajemen Status Registrasi",
          //   to: "/backoffice/registration-status/registration-status-management",
          // },
          {
            title: "Status Bayar",
            to: "/backoffice/registration-status/payment-status",
          },
        ]
      },
      {
        title: "Rencana Studi",
        icon: Book2Icon,
        children: [
          {
            title: "Manajemen Rencana Studi",
            to: "/backoffice/study-plan/study-plan-management",
          },
          {
            title: "Rencana Studi Massal",
            to: "/backoffice/study-plan/bulk-study-plan",
          },
        ]
      },
      {
        title: "Persetujuan KRS",
        icon: PlayCardOffIcon,
        children: [
          {
            title: "Manajemen Persetujuan KRS",
            to: "/backoffice/study-plan-card-approval/study-plan-card-approval-management",
          },
        ]
      },
      {
        title: "Peserta Kelas",
        icon: UsersIcon,
        children: [
          {
            title: "Manajemen Peserta Kelas",
            to: "/backoffice/class-participants/classroom-management",
          },
          {
            title: "Pindah Kelas",
            to: "/backoffice/class-participants/change-class",
          },
          {
            title: "Pembagian Kelas",
            to: "/backoffice/class-participants/dividing-class",
          },
          {
            title: "Gabung Kelas",
            to: "/backoffice/class-participants/join-class",
          },
          {
            title: "Presensi",
            to: "/backoffice/class-participants/attendance",
          },
          {
            title: "Cetak Presensi",
            to: "/backoffice/class-participants/print-attendance",
          },
          {
            title: "Rekap Kehadiran Mahasiswa",
            to: "/backoffice/class-participants/student-attendance-recap",
          },
          {
            title: "Rekap Kehadiran Dosen",
            to: "/backoffice/class-participants/lecturer-attendance-recap",
          },
          {
            title: "Cetak Presensi UTS",
            to: "/backoffice/class-participants/print-attendance-uts",
          },
          {
            title: "Cetak Presensi UAS",
            to: "/backoffice/class-participants/print-attendance-uas",
          },
          {
            title: "Peran Pengawas Ujian",
            to: "/backoffice/class-participants/exam-supervisor-role",
          },
          {
            title: "Pengawas Ujian",
            to: "/backoffice/class-participants/exam-supervisor",
          },
          {
            title: "Rekap Pengawas Ujian",
            to: "/backoffice/class-participants/exam-supervisor-recap",
          },
        ]
      },
      {
        title: "Virtual Class",
        icon: BuildingCottageIcon,
        children: [
          {
            title: "Materi Kuliah",
            to: "/backoffice/virtual-class/course-material",
          },
          {
            title: "Tugas Kuliah",
            to: "/backoffice/virtual-class/coursework",
          },
          {
            title: "Agenda Kelas",
            to: "/backoffice/virtual-class/class-agenda",
          },
          // {
          //   title: "Diskusi Online",
          //   to: "/backoffice/virtual-class/online-discussion",
          // },
          {
            title: "Ujian Kelas",
            to: "/backoffice/virtual-class/class-exam",
          },
        ]
      },
      {
        title: "Input Nilai",
        icon: FolderIcon,
        children: [
          {
            title: "Input Nilai Per Kelas",
            to: "/backoffice/input-value/input-value-per-class",
          },
          {
            title: "Input Nilai Per Mahasiswa",
            to: "/backoffice/input-value/input-value-per-student",
          },
        ]
      },
      // {
      //   title: "Nilai",
      //   icon: FolderIcon,
      //   children: [
      //     {
      //       title: "Nilai Per Kelas",
      //       to: "/backoffice/value/value-per-class",
      //     },
      //     {
      //       title: "Nilai Per Mahasiswa",
      //       to: "/backoffice/value/value-per-student",
      //     },
      //     {
      //       title: "Ubah Nilai Massal",
      //       to: "/backoffice/value/bulk-change-value",
      //     },
      //   ]
      // },
      {
        title: "Rekap Nilai",
        icon: Book2Icon,
        children: [
          {
            title: "Manajemen Rekap Nilai",
            to: "/backoffice/value-recap/value-recap-management",
          },
        ]
      },
      {
        title: "Hasil Studi",
        icon: FolderIcon,
        children: [
          {
            title: "Hasil Studi Per Semester",
            to: "/backoffice/study-result/study-result-per-semester",
          },
          {
            title: "Hasil Studi Per Mahasiswa",
            to: "/backoffice/study-result/study-result-per-student",
          },
        ]
      },
      {
        title: "Aktivitas Mahasiswa",
        icon: FolderIcon,
        children: [
          {
            title: "Pengelolaan Aktifitas Mahasiswa",
            to: "/backoffice/student-activities/management-of-student-activities",
          },
        ]
      },
      {
        title: "Tugas Akhir",
        icon: FolderIcon,
        children: [
          {
            title: "Peran Dosen Pembimbing TA",
            to: "/backoffice/thesis/the-role-of-the-thesis-supervisor",
          },
          {
            title: "Peran Dosen Ujian TA",
            to: "/backoffice/thesis/role-of-the-thesis-lecturer",
          },
          {
            title: "Judul Tugas Akhir",
            to: "/backoffice/thesis/title-of-thesis",
          },
          {
            title: "Pendaftaran Tugas Akhir",
            to: "/backoffice/thesis/thesis-registration",
          },
          {
            title: "Pengelolaan Ujian TA",
            to: "/backoffice/thesis/management-of-thesis-exams",
          },
          {
            title: "Bimbingan Tugas Akhir",
            to: "/backoffice/thesis/thesis-guidance",
          },
          // {
          //   title: "Pendaftaran Ujian TA",
          //   to: "/backoffice/thesis/registration-for-thesis-examination",
          // },
          // {
          //   title: "Master Tesis",
          //   to: "/backoffice/thesis/masters-thesis",
          // },
        ]
      },
      {
        title: "Transkrip",
        icon: FolderIcon,
        children: [
          // {
          //   title: "Setting Transkrip",
          //   to: "/backoffice/transcript/transcript-settings",
          // },
          // {
          //   title: "Setting Transkrip",
          //   to: "/backoffice/transcript/value-transfer",
          // },
          {
            title: "Transkrip",
            to: "/backoffice/transcript/transcript",
          },
        ]
      },
      {
        title: "Menunggu UKOM",
        icon: FolderIcon,
        children: [
          {
            title: "Status Menunggu UKOM",
            to: "/backoffice/pending-competency/status-pending-competency-exam",
          },
        ]
      },
      {
        title: "Kelulusan",
        icon: FolderIcon,
        children: [
          {
            title: "Setting Gelar",
            to: "/backoffice/graduation/degree-settings",
          },
          {
            title: "Syarat Yudisium",
            to: "/backoffice/graduation/judicium-condition",
          },
          {
            title: "Sesi Yudisium",
            to: "/backoffice/graduation/judicium-session",
          },
          {
            title: "Pendaftaran Yudisium",
            to: "/backoffice/graduation/judicium-registration",
          },
          {
            title: "Pengelolaan Yudisium",
            to: "/backoffice/graduation/judicium-management",
          },
          {
            title: "Sesi Wisuda",
            to: "/backoffice/graduation/graduation-session",
          },
          {
            title: "Pendaftaran Wisudawan",
            to: "/backoffice/graduation/graduate-registration",
          },
          // {
          //   title: "Pengelolaan Wisudawan",
          //   to: "/backoffice/graduation/graduate-management",
          // },
          {
            title: "Master Mahasiswa Lulus",
            to: "/backoffice/graduation/graduate-student-masters",
          },
        ]
      },
      {
        title: "SKPI",
        icon: FolderIcon,
        children: [
          {
            title: "Master Capaian Pembelajaran",
            to: "/backoffice/skpi/master-of-learning-outcomes",
          },
          // {
          //   title: "Master SKPI",
          //   to: "/backoffice/skpi/skpi-masters",
          // },
          {
            title: "Pendaftaran SKPI",
            to: "/backoffice/skpi/skpi-registration",
          },
          {
            title: "Approval SKPI",
            to: "/backoffice/skpi/skpi-approval",
          },
        ]
      },
      // sementara
      // {
      //   title: "Evaluasi",
      //   icon: FolderIcon,
      //   children: [
      //     {
      //       title: "Setting Evaluasi",
      //       to: "/backoffice/evaluation/evaluation-settings",
      //     },
      //     {
      //       title: "Evaluasi 2 Tahun Pertama",
      //       to: "/backoffice/evaluation/twoo-year-evaluation",
      //     },
      //     {
      //       title: "Evaluasi 4 Tahun",
      //       to: "/backoffice/evaluation/four-year-evaluation",
      //     },
      //     {
      //       title: "Evaluasi Akhir",
      //       to: "/backoffice/evaluation/final-evaluation",
      //     },
      //   ]
      // },
      {
        title: "Laporan",
        icon: FolderIcon,
        children: [
          {
            title: "Daftar Rekap Status Akademik",
            to: "/backoffice/report/recap-list-of-academic-status",
          },
          {
            title: "Daftar Rekap Peserta Kelas",
            to: "/backoffice/report/class-recap-list",
          },
          {
            title: "Daftar Distribusi Indeks Prestasi",
            to: "/backoffice/report/gpa-distribution-list",
          },
          {
            title: "Daftar Distribusi Nilai",
            to: "/backoffice/report/value-distribution-list",
          },
          {
            title: "Daftar Distribusi Mata Kuliah",
            to: "/backoffice/report/course-distribution-list",
          },
          {
            title: "Daftar Distribusi Hasil Studi Semester",
            to: "/backoffice/report/distribution-list-of-semester-study-results",
          },
          {
            title: "Daftar Distribusi Hasil Studi Kumulatif",
            to: "/backoffice/report/distribution-list-of-cumulative-study-results",
          },
          {
            title: "Daftar Distribusi Asal Mahasiswa",
            to: "/backoffice/report/student-distribution-list",
          },
          {
            title: "Daftar Distribusi Asal SMTA",
            to: "/backoffice/report/smta-distribution-list",
          },
          {
            title: "Profil Lulusan Per Yudicium",
            to: "/backoffice/report/profile-of-graduates-per-judicium",
          },
          {
            title: "Distribusi Lulusan Berdasarkan IPK",
            to: "/backoffice/report/distribution-of-graduates-based-on-gpa",
          },
          {
            title: "Distribusi Lulusan Per Lama Studi",
            to: "/backoffice/report/distribution-of-graduates-per-length-of-study",
          },
          {
            title: "Distribusi Lulusan Per Tugas Akhir",
            to: "/backoffice/report/distribution-of-graduates-per-thesis",
          },
          {
            title: "Profil Ruralitas Mahasiswa",
            to: "/backoffice/report/student-rurality-profile",
          },
          {
            title: "Profil Status Akademik Mahasiswa",
            to: "/backoffice/report/student-academic-status-profile",
          },
          {
            title: "Profil Penyelenggaraan Pendidikan",
            to: "/backoffice/report/profile-of-education-administration",
          },
        ]
      },
      {
        title: "Portal Akademik",
        icon: FolderIcon,
        children: [
          {
            title: "Account Mahasiswa",
            to: "/backoffice/academic-portal/student-account",
          },
          {
            title: "Account Dosen",
            to: "/backoffice/academic-portal/lecturer-account",
          },
          // {
          //   title: "Reset Password Mahasiswa",
          //   to: "/backoffice/academic-portal/password-reset-student",
          // },
          // {
          //   title: "Buat Account Mahasiswa Massal",
          //   to: "/backoffice/academic-portal/bulk-create-student-account",
          // },
          // {
          //   title: "Buat Account Dosen Massal",
          //   to: "/backoffice/academic-portal/bulk-create-lecturer-account",
          // },
        ]
      },
      // sementara
      // {
      //   title: "Kuisioner",
      //   icon: FolderIcon,
      //   children: [
      //     {
      //       title: "Grup Jawaban",
      //       to: "/backoffice/questionnaire/answers-group",
      //     },
      //     {
      //       title: "Grup Pertanyaan",
      //       to: "/backoffice/questionnaire/questions-group",
      //     },
      //     {
      //       title: "Pertanyaan",
      //       to: "/backoffice/questionnaire/questions",
      //     },
      //     {
      //       title: "Waktu Kuisioner",
      //       to: "/backoffice/questionnaire/questionnaire-schedule",
      //     },
      //     {
      //       title: "Hasil Kuisioner",
      //       to: "/backoffice/questionnaire/questionnaire-results",
      //     },
      //   ]
      // },
      {
        title: "Penyelenggara MBKM",
        icon: FolderIcon,
        children: [
          {
            title: "Mahasiswa MBKM",
            to: "/backoffice/mbkm-participants/mbkm-student",
          },
          {
            title: "Kelas MBKM",
            to: "/backoffice/implementation-of-mbkm/mbkm-class",
          },
          // {
          //   title: "Jadwal Kelas MBKM",
          //   to: "/backoffice/implementation-of-mbkm/schedule-mbkm-class",
          // },
          // {
          //   title: "Jadwal Ujian MBKM",
          //   to: "/backoffice/implementation-of-mbkm/schedule-mbkm-exam",
          // },
          {
            title: "Mahasiswa Peserta MBKM",
            to: "/backoffice/implementation-of-mbkm/mbkm-participating-students",
          },
          {
            title: "Rencana Studi MBKM",
            to: "/backoffice/implementation-of-mbkm/mbkm-study-plan",
          },
          {
            title: "Input Nilai MBKM",
            to: "/backoffice/implementation-of-mbkm/input-value-mbkm",
          },
          {
            title: "Konversi Nilai MBKM",
            to: "/backoffice/implementation-of-mbkm/convert-value-mbkm",
          },
        ]
      },
      // {
      //   title: "Peserta MBKM",
      //   icon: FolderIcon,
      //   children: [
      //     {
      //       title: "Mahasiswa MBKM",
      //       to: "/backoffice/mbkm-participants/mbkm-student",
      //     },
      //     //sementara
      //     // {
      //     //   title: "Nilai Transfer MBKM",
      //     //   to: "/backoffice/mbkm-participants/mbkm-value-transfer",
      //     // },
      //     // {
      //     //   title: "Aktivitas Mahasiswa MBKM",
      //     //   to: "/backoffice/mbkm-participants/mbkm-student-activities",
      //     // },
      //     // {
      //     //   title: "Konversi Nilai MBKM",
      //     //   to: "/backoffice/mbkm-participants/mbkm-value-conversion",
      //     // },
      //   ]
      // },
    ];
  }
  return [];
}



export default sidebarItem;
