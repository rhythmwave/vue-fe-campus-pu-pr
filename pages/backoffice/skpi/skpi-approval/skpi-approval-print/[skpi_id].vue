<script setup lang="ts">
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import moment from 'moment';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';

import { GetStudentSkpiDetailData } from '~~/types/api/student-skpi/GetStudentSkpiDetail';

import { adminGetStudentSkpiDetail } from '~~/composables/api/admin-skpi/adminGetStudentSkpiDetail';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
const detail = ref(<GetStudentSkpiDetailData>{})
const skpi_id = ref('')

async function studentDetail() {
  try {
    const { response: resp, error: error } = await adminGetStudentSkpiDetail(skpi_id.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
        detail.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

onMounted(async () => {
    skpi_id.value = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
    await studentDetail()
    console.log(detail.value)
})
</script>
<template>
    <div>
        <table class="table text-left">
            <thead class="border-bottom">
                <tr>
                    <th width="50"></th>
                    <th width="50"></th>
                    <th width="200"></th>
                    <th width="200"></th>
                    <th width="50"></th>
                    <th width="50"></th>
                    <th width="200"></th>
                    <th width="200"></th>
                </tr>
                <tr>
                    <th colspan="2">
                        <img src="~/assets/img/logo_poltek_pu_semarang.png" style="width: 100%;" />
                    </th>
                    <th colspan="7">
                        <p class="text-arial-black text-18" style="margin-bottom: 5px;">POLITEKNIK PEKERJAAN UMUM</p>
                        <p class="text-13 text-bold">
                            BADAN PENGEMBANGAN SUMBER DAYA MANUSIA<br>
                            KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="border-bottom text-bold">
                    <td colspan="4">
                        <p class="text-17">
                            SURAT KETERANGAN PENDAMPING IJAZAH
                        </p>
                        <p>
                            <i>Diploma Supplement</i>
                        </p>
                        <p>
                            No: {{ detail.skpi_number }}
                        </p>
                    </td>
                    <td colspan="4">
                        <p style="margin-top: 10px">
                            {{ detail.student_name }}
                        </p>
                    </td>
                </tr>
                <tr class="border-bottom">
                    <td colspan="8" class="text-justify">
                        <p>
                            Surat Keterangan Pendamping Ijazah / SKPI adalah dokumen yang memuat informasi tentang pemenuhan kompetensi lulusan dalam suatu Program Pendidikan Tinggi. SKPI ini sebagai pelengkap Ijazah yang menerangkan capaian pembelajaran dan prestasi dari pemegang Ijazah selama masa studi
                        </p>
                        <br>
                        <p>
                            Certificate of Diploma Supplement is a document comprising the information on the fulfillment of graduate competencies in an Higher Education Program. This Certificate serves as a complement to the diploma elaborating the learning outcomes and achievements of the bearer of this Certificate during the study period.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td colspan="8" class="text-bold">
                        <p>
                            1. INFORMASI TENTANG IDENTITAS DIRI<br>
                            <i class="text-7">1. Personal Details Of The Bearer</i>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">1.1</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Nama Lengkap<br>
                            <i class="text-7">Full Name</i>
                        </p>
                        {{ detail.student_name }}
                    </td>
                    <td class="text-bold">1.5</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Tanggal Lulus<br>
                            <i class="text-7">Date of Graduation</i>
                        </p>
                        25-08-2022
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">1.2</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Tempat dan Tanggal Lahir<br>
                            <i class="text-7">Place and Date of Birth</i>
                        </p>
                        Klaten, 05-11-2000
                    </td>
                    <td class="text-bold">1.6</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Nomor Ijazah Nasional<br>
                            <i class="text-7">National Certificate Number</i>
                        </p>
                        224042022000322
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">1.3</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Nomor Induk Mahasiswa<br>
                            <i class="text-7">Student Identification Number</i>
                        </p>
                        191037
                    </td>
                    <td class="text-bold">1.7</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Gelar<br>
                            <i class="text-7">Academic Degree</i>
                        </p>
                        Ahli Madya Teknik
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">1.4</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Tanggal Masuk<br>
                            <i class="text-7">Date of Admission</i>
                        </p>
                        02-09-2019
                    </td>
                    <td class="text-bold">1.8</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Singkatan<br>
                            <i class="text-7">Academic Degree Abreviation</i>
                        </p>
                        A.Md.T
                    </td>
                </tr>
                <tr>
                    <td colspan="8" class="text-bold">
                        <p>
                            2. INFORMASI TENTANG IDENTITAS PENYELENGGARA PROGRAM<br>
                            <i class="text-7">2. Details Of The Institution</i>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">2.1</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Akreditasi Program Studi<br>
                            <i class="text-7">Accreditation Number of Study Program</i>
                        </p>
                        3021/SK/BAN-PT/Akred/Dipl-III/V/2021, Terakreditasi Baik
                    </td>
                    <td class="text-bold">2.7</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Bahasa Pengantar Kuliah<br>
                            <i class="text-7">Language of Instruction</i>
                        </p>
                        Bahasa Indonesia
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">2.2</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Perguruan Tinggi<br>
                            <i class="text-7">University</i>
                        </p>
                        Politeknik Pekerjaan Umum
                    </td>
                    <td class="text-bold">2.8</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Sistem Penilaian<br>
                            <i class="text-7">Evaluation System</i>
                        </p>
                        A=4.00; AB=3.50; B=3.00; BC=2.50; C=2.00; CD=1.50; D=1.00; E=0.00;
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">2.3</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Program Studi<br>
                            <i class="text-7">Study Program</i>
                        </p>
                        TEKNOLOGI KONSTRUKSI BANGUNAN AIR
                    </td>
                    <td class="text-bold">2.9</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Lama Studi<br>
                            <i class="text-7">Duration of Study</i>
                        </p>
                        6 Semester
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">2.4</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Jenis & Jenjang Pendidikan<br>
                            <i class="text-7">Type & Level of Education</i>
                        </p>
                        D3 / Diploma III
                    </td>
                    <td class="text-bold">2.10</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Jumlah SKS<br>
                            <i class="text-7">Number of Credits Semester</i>
                        </p>
                        117
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">2.5</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Jenjang Kualifikasi sesuai KKNI<br>
                            <i class="text-7">Qualification Level Based on Indonesian National Qualificatons Framework</i>
                        </p>
                        Level 5
                    </td>
                    <td class="text-bold">2.11</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Jenis dan Jenjang Pendidikan Lanjutan<br>
                            <i class="text-7">Access to Futher Study</i>
                        </p>
                        Diploma IV
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">2.5</td>
                    <td colspan="3">
                        <p class="text-bold">
                            Persyaratan Penerimaan<br>
                            <i class="text-7">Admission Requirements</i>
                        </p>
                        SMA/SMK/MA
                    </td>
                </tr>
                <tr>
                    <td colspan="8" class="text-bold">
                        <p>
                            3. INFORMASI TENTANG CAPAIAN PEMBELAJARAN DAN KUALIFIKASI HASIL YANG DICAPAI<br>
                            <i class="text-7">3. Information On Learning Outcomes And Qualifications</i>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">3.1</td>
                    <td colspan="3" class="text-bold">
                        <p>
                            Capaian Pembelajaran<br>
                            <i class="text-7">Learning Outcomes</i>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td colspan="3" class="text-bold">
                        <p>Sikap dan Tata Nilai</p>
                    </td>
                    <td></td>
                    <td colspan="3" class="text-bold">
                        <p>Attitudes and Values</p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td colspan="3">
                        <ol>
                            <li>Bertakwa kepada Tuhan Yang Maha Esa dan mampu menunjukkan sikap religius;</li>
                            <li>Menjunjung tinggi nilai kemanusiaan dalam menjalankan tugas berdasarkan agama,moral, dan etika;</li>
                            <li>Berkontribusi dalam peningkatan mutu kehidupan bermasyarakat, berbangsa, bernegara, dan kemajuan peradaban berdasarkan Pancasila;</li>
                            <li>Berperan sebagai warga negara yang bangga dan cinta tanah air, memiliki nasionalisme serta rasa tanggungjawab pada negara dan bangsa;</li>
                            <li>Menghargai keanekaragaman budaya, pandangan, agama, dan kepercayaan, serta pendapat atau temuan orisinal orang lain;</li>
                            <li>Bekerja sama dan memiliki kepekaan sosial serta kepedulian terhadap masyarakat dan lingkungan;</li>
                            <li>Taat hukum dan disiplin dalam kehidupan bermasyarakat dan bernegara;</li>
                            <li>Menginternalisasi nilai, norma, dan etika akademik;</li>
                            <li>Menunjukkan sikap bertanggungjawab atas pekerjaan di bidang keahliannya secara mandiri; dan</li>
                            <li>Menginternalisasi semangat kemandirian, kejuangan, dan kewirausahaan.</li>
                        </ol>
                    </td>
                    <td></td>
                    <td colspan="3">
                        <ol>
                            <li>Fear of God Almighty and able to show a religious attitude;</li>
                            <li>Upholding human values in carrying out duties based on religion, morals, and ethics;</li>
                            <li>Contribute to improving the quality of life in society, nation, state, and the advancement of civilization based on Pancasila;</li>
                            <li>To act as citizens who are proud and love their homeland, have nationalism and a sense of responsibility to the country and nation;</li>
                            <li>Appreciate the diversity of cultures, views, religions, and beliefs, as well as the opinions or original findings of others;</li>
                            <li>Cooperate and have social sensitivity and concern for society and the environment;</li>
                            <li>Obey the law and discipline in the life of society and the state;</li>
                            <li>Internalize academic values, norms, and ethics;</li>
                            <li>Demonstrate an attitude of being responsible for work in their field of expertise independently; and</li>
                            <li>Internalize the spirit of independence, struggle, and entrepreneurship.</li>
                        </ol>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td colspan="3" class="text-bold">
                        <p>Pengetahuan yang Dikuasai</p>
                    </td>
                    <td></td>
                    <td colspan="3" class="text-bold">
                        <p>Mastered Knowledge</p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td colspan="3">
                        <ol>
                            <li>Memahami konsep teoritis sains alam dan matematika terapan secara umum;</li>
                            <li>Memahami konsep teroritis sains rekayasa, prinsip rekayasa secara mendalam;</li>
                            <li>Memahami konsep, prinsip, metode dan teknik perawatan dan perbaikan komponen dalam skala terbatas;</li>
                            <li>Memahami pengetahuan operasional perawatan dan perbaikan komponen skala terbatas;</li>
                            <li>Memahami pengetahuan faktual dan metode aplikasi referensi teknis (kode dan standar) nasional dan internasional serta pengaturan yang berlaku di wilayah kerjanya;</li>
                            <li>Memahami prinsip-prinsip penjaminan mutu produk;</li>
                            <li>Memahami konsep dan prinsip pelestarian lingkungan;</li>
                            <li>Memahami pengetahuan faktual isu terkini dalam masalah ekonomi, sosial, ekologi secara umum pada bidang kerjanya;</li>
                            <li>Memahami prinsip dan tata kerja bengkel, studio dan kegiatan laboratorium serta pelaksanaan keselamatan kerja dan lingkungan (K3L);</li>
                            <li>Memahami prinsip dan teknik berkomunikasi yang efektif secara lisan dan tulisan;</li>
                            <li>Memahami pengetahuan faktual tentang perkembangan teknologi konstruksi bangunan air mutakhir.</li>
                        </ol>
                    </td>
                    <td></td>
                    <td colspan="3">
                        <ol>
                            <li>Understand the theoretical concepts of natural science and applied mathematics in general;</li>
                            <li>Understand the theoretical concepts of engineering science, engineering principles in depth;</li>
                            <li>Understand the concepts, principles, methods and techniques of maintenance and repair of components on a limited scale;</li>
                            <li>Understanding of operational knowledge of maintenance and repair of limited-scale components;</li>
                            <li>Understand factual knowledge and application methods of national and international technical references (codes and standards) as well as regulations that apply in their working area;</li>
                            <li>Understand the principles of product quality assurance;</li>
                            <li>Understand the concepts and principles of environmental conservation;</li>
                            <li>Understanding factual knowledge of current issues in economic, social, ecological issues in general in their field of work;</li>
                            <li>Understand the principles and work procedures of workshops, studios and laboratory activities as well as the implementation of work safety and the environment (K3L);</li>
                            <li>Understand the principles and techniques of effective communication orally and in writing;</li>
                            <li>Understand factual knowledge about the development of the latest water building construction technology.</li>
                        </ol>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td colspan="3" class="text-bold">
                        <p>Kewenangan dan Tanggungjawab</p>
                    </td>
                    <td></td>
                    <td colspan="3" class="text-bold">
                        <p>Authority and Responsibilities</p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td colspan="3">
                        <ol>
                            <li>Mampu menyelesaikan pekerjaan berlingkup luas dan menganalisis data dengan beragam metode yang sesuai, baik yang belum maupun yang sudah baku;</li>
                            <li>Mampu menunjukkan kinerja bermutu dan terukur;</li>
                            <li>Mampu memecahkan masalah pekerjaan dengan sifat dan konteks yang sesuai dengan bidang keahlian terapannya didasarkan pada pemikiran logis, inovatif, dan bertanggung jawab atas hasilnya secara mandiri;</li>
                            <li>Mampu menyusun laporan hasil dan proses kerja secara akurat dan sahih serta mengomunikasi- kannya secara efektif kepada pihak lain yang membutuhkan;</li>
                            <li>Mampu bekerja sama, berkomunikasi, dan berinovatif dalam pekerjaannya;</li>
                            <li>Mampu bertanggungjawab atas pencapaian hasil kerja kelompok dan melakukan supervisi dan evaluasi terhadap penyelesaian pekerjaan yang ditugaskan kepada pekerja yang berada di bawah tanggungjawabnya;</li>
                            <li>Mampu melakukan proses evaluasi diri terhadap kelompok kerja yang berada di bawah tanggung jawabnya, dan mengelola pengembangan kompetensi kerja secara mandiri;</li>
                            <li>Mampu mendokumentasikan, menyimpan, mengamankan, dan menemukan kembali data untuk menjamin kesahihan dan mencegah plagiasi.</li>
                        </ol>
                    </td>
                    <td></td>
                    <td colspan="3">
                        <ol>
                            <li>Able to complete wide-ranging work and analyze data with various appropriate methods, both undefined and standardized;</li>
                            <li>Able to demonstrate quality and measurable performance;</li>
                            <li>Able to solve work problems with the nature and context in accordance with the field of applied expertise based on logical thinking, innovative, and responsible for the results independently;</li>
                            <li>Able to compile reports on the results and work processes of water construction work accurately and validly and communicate them effectively to other parties in need;</li>
                            <li>Able to work together, communicate, and be innovative in their work;</li>
                            <li>Capable of being responsible for the achievement of group work results and supervising and evaluating the completion of water construction works assigned to workers under their responsibility;</li>
                            <li>Able to carry out the process of self-evaluation of the work group under their responsibility, and manage the development of work competencies independently;</li>
                            <li>Able to document, store, secure, and retrieve data to ensure validity and prevent plagiarism.</li>
                        </ol>
                    </td>
                </tr>
                <tr>
                    <td class="text-bold">3.2</td>
                    <td colspan="3" class="text-bold">
                        <p>
                            Informasi Tambahan<br>
                            <i class="text-7">Additional Information</i>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td class="text-bold"></td>
                    <td colspan="3" class="text-bold">
                        <p>
                            3.2.1. Prestasi dan Penghargaan<br>
                            <i class="text-7">3.2.1. Achievements and Awards</i>
                        </p>
                        aadasdasd
                    </td>
                </tr>
                <tr>
                    <td class="text-bold"></td>
                    <td colspan="3" class="text-bold">
                        <p>
                            3.2.1. Prestasi dan Penghargaan<br>
                            <i class="text-7">3.2.1. Achievements and Awards</i>
                        </p>
                        isi prestasi
                    </td>
                </tr>
                <tr>
                    <td class="text-bold"></td>
                    <td colspan="3" class="text-bold">
                        <p>
                            3.2.2. Pengalaman Organisasi<br>
                            <i class="text-7">3.2.2. Organizational Experiences</i>
                        </p>
                        pengalaman organisasi
                    </td>
                </tr>
                <tr>
                    <td class="text-bold"></td>
                    <td colspan="3" class="text-bold">
                        <p>
                            3.2.3. Sertifikat Keahlian<br>
                            <i class="text-7">3.2.3. Certificates of Expertise</i>
                        </p>
                        Sertifikat Keahlian
                    </td>
                </tr>
                <tr>
                    <td class="text-bold"></td>
                    <td colspan="3" class="text-bold">
                        <p>
                            3.2.4. Kerja Praktek/Magang<br>
                            <i class="text-7">3.2.4. Internship</i>
                        </p>
                        Kerja Praktek/Magang
                    </td>
                </tr>
                <tr>
                    <td class="text-bold"></td>
                    <td colspan="3" class="text-bold">
                        <p>
                            3.2.5. Tugas Akhir<br>
                            <i class="text-7">3.2.5. Final Project</i>
                        </p>
                        Kerja Praktek/Magang
                    </td>
                </tr>
                <tr>
                    <td class="text-bold"></td>
                    <td colspan="3" class="text-bold">
                        <p>
                            3.2.6. Bahasa Internasional<br>
                            <i class="text-7">3.2.6. International Language</i>
                        </p>
                        Kerja Praktek/Magang
                    </td>
                </tr>
                <tr>
                    <td class="text-bold"></td>
                    <td colspan="3" class="text-bold">
                        <p>
                            3.2.7. Pendidikan Karakter<br>
                            <i class="text-7">3.2.7. Character Education</i>
                        </p>
                        Kerja Praktek/Magang
                    </td>
                </tr>
                <tr>
                    <td colspan="8" class="text-bold">
                        <p>
                            3. PENGESAH SKPI<br>
                            <i class="text-7">4. SKPI Legalization</i>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="text-right">
                        <div class="text-center" style="margin: 0px 50px 0px 0px;">
                            <p>{{ new Date().getDate() }}, {{ convertMonthToTextString(new Date().getMonth() + 1) }} {{ new Date().getFullYear() }}</p>
                            <p>..................................................</p>
                            <p style="margin-top: 100px; border-bottom:1px solid">..................................................</p>
                            <p>NIP: ........................................</p>
                        </div>
                    </td>
                    <td colspan="5"></td>
                </tr>
            </tbody>
        </table>
        <table>
            <thead>
                <tr>
                    <th width="50"></th>
                    <th width="50"></th>
                    <th width="200"></th>
                    <th width="200"></th>
                    <th width="50"></th>
                    <th width="50"></th>
                    <th width="200"></th>
                    <th width="200"></th>
                </tr>
                <tr>
                    <th colspan="2">
                        <img src="~/assets/img/logo_poltek_pu_semarang.png" style="width: 100%;" />
                    </th>
                    <th colspan="7">
                        <p class="text-arial-black text-18" style="margin-bottom: 5px;">POLITEKNIK PEKERJAAN UMUM</p>
                        <p class="text-13 text-bold">
                            BADAN PENGEMBANGAN SUMBER DAYA MANUSIA<br>
                            KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="border-bottom">
                    <td colspan="4">
                        CATATAN RESMI
                    </td>
                    <td colspan="4">
                        OFFICIAL NOTES
                    </td>
                </tr>
                <tr class="border-bottom">
                    <td colspan="4">
                        <ul>
                            <li>SKPI dikeluarkan oleh institusi pendidikan tinggi yang berwenang mengeluarkan ijazah sesuai dengan paraturan perundang-undangan yang berlaku.</li>
                            <li>SKPI hanya diterbitkan setelah mahasiswa dinyatakan lulus dari suatu program studi secara resmi oleh Perguruan Tinggi.</li>
                            <li>SKPI diterbitkan dalam Bahasa Indonesia dan Bahasa Inggris.</li>
                            <li>SKPI yang asli diterbitkan mengunakan kertas khusus berlogo Perguruan Tinggi, yang diterbitkan secara khusus oleh Perguruan Tinggi.</li>
                            <li>Penerima SKPI dicantumkan dalam situs resmi Perguruan Tinggi.</li>
                        </ul>
                    </td>
                    <td colspan="4">
                        <ul>
                            <li>This Diploma Supplement is issued by the higher education institution authorized to issue diplomas in accordance with the applicable laws and regulations.</li>
                            <li>This Diploma Supplement is issued after the student is officially declared a graduate of a study program by a higher education institution.</li>
                            <li>This Diploma Supplement is written in both Bahasa Indonesia.</li>
                            <li>The original copy of this Diploma Supplement is issued by the higher education institution, printed on a special paper with the official seal of the higher education institution.</li>
                            <li>The bearer of this Diploma Supplement is officially listed in the higher education institution's official website.</li>
                        </ul>
                    </td>
                </tr>
                <tr class="border-bottom">
                    <td colspan="2">
                        <p class="text-bold">Alamat</p>
                        <p class="text-bold">Telepon</p>
                        <p class="text-bold">Fax</p>
                        <p class="text-bold">Website</p>
                        <p class="text-bold">Email</p>
                    </td>
                    <td colspan="6">
                        <p class="text-bold">Jl. Soekarno - Hatta No. 100 Semarang 50166</p>
                        <p class="text-bold">(024)7472848</p>
                        <p class="text-bold">(024)7472848</p>
                        <p class="text-bold">www.politeknikpu.ac.id</p>
                        <p class="text-bold">akademik@politeknikpu.ac.id</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="8">
                        <p class="text-bold">Surat Keterangan Pendamping Ijazah / Diploma Supplement</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
table {
    font-family: 'Arial' !important;
    font-size: 12px;
}
table > thead > tr > th {
    font-size: 12px;
}
table {
    background-color: transparent;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
}
.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
}
.head-title {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    border: 1px solid #2d2d2d;
}
/* .table > tbody > tr > td {
    border: 1px solid #2d2d2d;
} */
table {
    border-spacing: 0;
    border-collapse: collapse;
}
td, th {
    padding: 0;
}
th {
    font-weight: 400;
}
.table {
    border-collapse: collapse !important;
}
.table td, .table th {
    background-color: #fff !important;
}
.font-size-10{
    font-size: 10px;
}
table { 
    page-break-inside:avoid;
    /* page-break-after: always; */
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.text-center {
  text-align: center;
}
.text-justify {
  text-align: justify;
}
.text-nowrap {
  white-space: nowrap;
}
.text-lowercase {
  text-transform: lowercase;
}
.text-uppercase {
  text-transform: uppercase;
}
.text-capitalize {
  text-transform: capitalize;
}
.text-arial-black {
    font-family: 'Arial Black' !important;
}
.text-bold {
    font-weight: bold;
}
.text-18 {
    font-size: 18pt;
}
.text-17 {
    font-size: 17pt;
}
.text-13 {
    font-size: 13pt;
}
.text-7 {
    font-size: 7pt;
}
.border-bottom {
    border-bottom: 1px solid #acb8c4
}
</style>