// project imports
import mock from './mockAdapter';

import type { notificationType, profileType, languageType, appsLinkType, quickLinksType,searchType } from '@/types/HeaderTypes'
// 
// Notification
// 
import user1 from '/images/profile/user-1.jpg';
import user2 from '/images/profile/user-2.jpg';
import user3 from '/images/profile/user-3.jpg';
import user4 from '/images/profile/user-4.jpg';
import user5 from '/images/profile/user-5.jpg';

const notifications:notificationType[] = [
    {
        avatar: user1,
        title: 'Roman Joined the Team!',
        subtitle: 'Congratulate him'
    },
    {
        avatar: user2,
        title: 'New message received',
        subtitle: 'Salma sent you new message'
    },
    {
        avatar: user3,
        title: 'New Payment received',
        subtitle: 'Check your earnings'
    },
    {
        avatar: user4,
        title: 'Jolly completed tasks',
        subtitle: 'Assign her new tasks'
    },
    {
        avatar: user5,
        title: 'New Payment received',
        subtitle: 'Check your earnings'
    },
    {
        avatar: user1,
        title: 'Roman Joined the Team!',
        subtitle: 'Congratulate him'
    }
];

// 
// Profile 
// 
import proUser1 from '/images/svgs/icon-account.svg';
import proUser2 from '/images/svgs/icon-tasks.svg';
import proUser3 from '/images/svgs/icon-tasks.svg';
const profileDD: profileType[] = [
    {
        avatar: proUser1,
        title: 'Profile',
        subtitle: 'Detail Profile',
        href: '/academic-portal/profile'
    },
    {
        avatar: proUser2,
        title: 'Ubah Password',
        subtitle: 'Ubah Password Pengguna',
        href: '/'
    },
    // {
    //     avatar: proUser3,
    //     title: 'My Tasks',
    //     subtitle: '',
    //     href: '/'
    // }
];

// 
// Language
// 
import flag1 from '/images/flag/icon-flag-en.svg';
import flag2 from '/images/flag/icon-flag-fr.svg';
import flag3 from '/images/flag/icon-flag-ro.svg';
import flag4 from '/images/flag/icon-flag-zh.svg';
const languageDD: languageType[] = [
    { title: 'English', subtext: 'UK', value: 'en', avatar: flag1 },
    { title: 'français', subtext: 'French', value: 'fr', avatar: flag2 },
    { title: 'عربي', subtext: 'Arbic', value: 'ro', avatar: flag3 },
    { title: '中国人', subtext: 'Chinese', value: 'zh', avatar: flag4 }
];

// 
// AppsLink
// 
const academicsStudentsLink: appsLinkType[] = [
    {
        avatar: '',
        title: 'Biodata',
        subtext: '',
        href: '/academic-portal/academic/biodata'
    }, {
        avatar: '',
        title: 'Data Orang Tua',
        subtext: '',
        href: '/academic-portal/academic/parent-data'
    },
    {
        avatar: '',
        title: 'Data SMA/SMK',
        subtext: '',
        href: '/academic-portal/academic/highschool-data'
    },
    {
        avatar: '',
        title: 'Mata Kuliah Ditawarkan',
        subtext: '',
        href: '/academic-portal/academic/offered-subject'
    },
    {
        avatar: '',
        title: 'Kartu Rencana Study',
        subtext: '',
        href: '/academic-portal/academic/study-plan'
    },
    {
        avatar: '',
        title: 'Presensi Perkuliahan',
        subtext: '',
        href: '/academic-portal/academic/presences'
    },
    {
        avatar: '',
        title: 'Cetak Kartu Ujian',
        subtext: '',
        href: '/academic-portal/academic/print-exam-card'
    },
    {
        avatar: '',
        title: 'Kartu Hasil Studi',
        subtext: '',
        href: '/academic-portal/academic/study-results-card'
    },
    {
        avatar: '',
        title: 'Transkrip Nilai',
        subtext: '',
        href: '/academic-portal/academic/transcripts'
    },
    {
        avatar: '',
        title: 'Pendaftaran Tugas Akhir',
        subtext: '',
        href: '/academic-portal/academic/final-exam-registration'
    },
    {
        avatar: '',
        title: 'Surat Keterangan Pendamping Ijazah',
        subtext: '',
        href: '/academic-portal/academic/certificate-escort-letter'
    },
    {
        avatar: '',
        title: 'Riwayat Bimbingan Akademik',
        subtext: '',
        // href: '/academic-portal/academic/academic-guidance-history'
        href: '/academic-portal/academic/student-academic-guidance'
    },
    // {
    //     avatar: '',
    //     title: 'Informasi Tagihan & Pembayaran',
    //     subtext: '',
    //     href: '/academic-portal/academic/bill-payment'
    // },
    // {
    //     avatar: '',
    //     title: 'Hasil Kuisioner',
    //     subtext: '',
    //     href: '/academic-portal/academic/questions-results'
    // },
    {
        avatar: '',
        title: 'Informasi Akademik',
        subtext: '',
        href: '/academic-portal/academic/academic-information'
    },
    {
        avatar: '',
        title: 'Pengajuan Cuti',
        subtext: '',
        href: '/academic-portal/academic/leave-application'
    },
    // {
    //     avatar: '',
    //     title: 'Bimbingan Akademik',
    //     subtext: '',
    //     href: '/academic-portal/academic/student-academic-guidance'
    // },
];
const academicsLecturersLink: appsLinkType[] = [
    {
        avatar: '',
        title: 'Mata Kuliah Ditawarkan',
        subtext: '',
        href: '/academic-portal/academic/offered-subject'
    },
    {
        avatar: '',
        title: 'Mata Kuliah Diampu',
        subtext: '',
        href: '/academic-portal/academic/subject-enabled'
    },
    {
        avatar: '',
        title: 'Bimbingan Akademik',
        subtext: '',
        href: '/academic-portal/academic/academic-guidance'
    },
    {
        avatar: '',
        title: 'Pengelolaan Nilai',
        subtext: '',
        href: '/academic-portal/academic/grade-management'
    },
    {
        avatar: '',
        title: 'Pengelolaan Presensi',
        subtext: '',
        href: '/academic-portal/academic/presence-management'
    },
    // {
    //     avatar: '',
    //     title: 'Hasil Kuisioner',
    //     subtext: '',
    //     href: '/academic-portal/academic/questions-results'
    // },
    {
        avatar: '',
        title: 'Informasi Akademik',
        subtext: '',
        href: '/academic-portal/academic/academic-information'
    },
];


const virtualClassesLink: appsLinkType[] = [
    {
        avatar: '',
        title: 'Materi Kuliah',
        subtext: '',
        href: '/academic-portal/virtual-class/course-material'
    },
    {
        avatar: '',
        title: 'Pengumuman',
        subtext: '',
        href: '/academic-portal/virtual-class/announcement'
    },
    {
        avatar: '',
        title: 'Tugas Kuliah',
        subtext: '2 Unsaved Contacts',
        href: '/academic-portal/virtual-class/assignments'
    },
    {
        avatar: '',
        title: 'Ujian Kelas',
        subtext: '',
        href: '/academic-portal/virtual-class/exams'
    },
    // {
    //     avatar: '',
    //     title: 'Diskusi Online',
    //     subtext: '',
    //     href: '/academic-portal/virtual-class/online-discussions'
    // },
    {
        avatar: '',
        title: 'Agenda Kelas',
        subtext: '',
        href: '/academic-portal/virtual-class/class-agenda'
    },
    // {
    //     avatar: '',
    //     title: 'Agenda Pribadi',
    //     subtext: '',
    //     href: '/academic-portal/virtual-class/personal-agenda'
    // },
    {
        avatar: '',
        title: 'File Sharing',
        subtext: '',
        href: '/academic-portal/virtual-class/file-sharing'
    },
    // {
    //     avatar: '',
    //     title: 'Referensi',
    //     subtext: '',
    //     href: '/academic-portal/virtual-class/references'
    // },
    // {
    //     avatar: '',
    //     title: 'Forum Diskusi',
    //     subtext: '',
    //     href: '/academic-portal/virtual-class/forums'
    // },
];
// 
// Quick Links
// 
const quickLink: quickLinksType[] = [
    {
        title: 'Pricing Page',
        href: '/theme-pages/pricing'
    },
    {
        title: 'Authentication Design',
        href: '/auth/login'
    },
    {
        title: 'Register Now',
        href: '/auth/register'
    },
    {
        title: '404 Error Page',
        href: '/auth/404'
    },
    {
        title: 'Notes App',
        href: '/apps/notes'
    },
    {
        title: 'User Application',
        href: '/apps/user/profile'
    },
    {
        title: 'Blog Design',
        href: '/apps/blog/posts'
    },
    {
        title: 'Shopping Cart',
        href: '/apps/ecommerce/checkout'
    }
];

// 
// Search Data
// 
const searchSugg: searchType[] = [
    {
        title: 'Modern',
        href: '/dashboards/modern'
    },
    {
        title: 'eCommerce',
        href: '/dashboards/ecommerce'
    },
    {
        title: 'Contacts',
        href: '/apps/contacts'
    },
    {
        title: 'Shop',
        href: '/apps/ecommerce/products'
    },
    {
        title: 'Checkout',
        href: '/apps/ecommerce/checkout'
    },
    {
        title: 'Chats',
        href: '/apps/chats'
    },
    {
        title: 'Notes',
        href: '/apps/notes'
    },
    {
        title: 'Pricing',
        href: '/theme-pages/pricing'
    },
    {
        title: 'Account Setting',
        href: '/theme-pages/account-settings'
    },
];

export { notifications, profileDD, languageDD, academicsStudentsLink,academicsLecturersLink,virtualClassesLink, quickLink, searchSugg };

