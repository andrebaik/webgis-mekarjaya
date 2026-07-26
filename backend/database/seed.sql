-- Seed Data for WebGIS Desa Mekarjaya
-- Koordinat eksak: -7.24, 107.8572
-- Desa Mekarjaya, Kecamatan Cikajang, Kabupaten Garut, Jawa Barat

USE `webgis_mekarjaya`;

DELETE FROM `locations`;
DELETE FROM `categories`;
ALTER TABLE `categories` AUTO_INCREMENT = 1;
ALTER TABLE `locations` AUTO_INCREMENT = 1;

INSERT INTO `categories` (`slug`, `name_id`, `name_su`, `name_en`, `icon`) VALUES
('sekolah', 'Sekolah', 'Sakola', 'School', 'school'),
('puskesmas', 'Puskesmas', 'Puskesmas', 'Health Center', 'hospital'),
('desa', 'Kantor Desa', 'Kantor Desa', 'Village Office', 'building-government'),
('ibadah', 'Tempat Ibadah', 'Tempat Ibadah', 'Place of Worship', 'place-of-worship'),
('wisata', 'Wisata', 'Wisata', 'Tourism', 'camera'),
('umkm', 'UMKM', 'UMKM', 'MSME', 'store'),
('lapangan', 'Lapangan', 'Lapangan', 'Multi-purpose Field', 'field'),
('jembatan', 'Jembatan', 'Jambatan', 'Bridge', 'bridge'),
('sungai', 'Sungai', 'Walungan', 'River', 'water'),
('pasar', 'Pasar', 'Pasar', 'Market', 'shopping-cart'),
('perkebunan', 'Perkebunan', 'Perkebunan', 'Plantation', 'trees');

INSERT INTO `locations` (`slug`, `category_id`, `name_id`, `name_su`, `name_en`, `description_id`, `description_su`, `description_en`, `coordinates`, `images`, `featured`) VALUES
-- Sekolah
('sdn-1-mekarjaya', 1, 'SDN 1 Mekarjaya', 'SDN 1 Mekarjaya', 'SDN 1 Mekarjaya Elementary School', 'Sekolah Dasar Negeri 1 Mekarjaya melayani pendidikan tingkat dasar untuk putra-putri Desa Mekarjaya dan sekitarnya.', 'SDN 1 Mekarjaya nyadiakeun pendidikan dasar pikeun murangkalih Desa Mekarjaya.', 'SDN 1 Mekarjaya provides primary education for children of Mekarjaya Village.', '[107.8315, -7.3870]', '["https://example.com/images/sdn1-1.jpg"]', TRUE),

('sdn-2-mekarjaya', 1, 'SDN 2 Mekarjaya', 'SDN 2 Mekarjaya', 'SDN 2 Mekarjaya Elementary School', 'Sekolah Dasar Negeri 2 Mekarjaya merupakan sekolah dasar kedua yang melayani wilayah timur Desa Mekarjaya.', 'SDN 2 Mekarjaya mangrupikeun sakola dasar kadua anu ngalayanan wilayah wetan Desa Mekarjaya.', 'SDN 2 Mekarjaya is the second elementary school serving East Mekarjaya.', '[107.8335, -7.3885]', '["https://example.com/images/sdn2-1.jpg"]', FALSE),

('smp-1-cikajang', 1, 'SMPN 1 Cikajang', 'SMPN 1 Cikajang', 'SMPN 1 Cikajang Junior High School', 'Sekolah Menengah Pertama Negeri 1 Cikajang melayani pendidikan menengah pertama untuk warga Kecamatan Cikajang termasuk Desa Mekarjaya.', 'SMPN 1 Cikajang ngalayanan pendidikan menengah pertama pikeun warga Kacamatan Cikajang kalebet Desa Mekarjaya.', 'SMPN 1 Cikajang provides secondary education for Cikajang District including Mekarjaya.', '[107.8285, -7.3840]', '["https://example.com/images/smp1-1.jpg"]', FALSE),

-- Puskesmas
('puskesmas-cikajang', 2, 'Puskesmas Cikajang', 'Puskesmas Cikajang', 'Cikajang Health Center', 'Puskesmas Cikajang menyediakan layanan kesehatan primer dan rujukan bagi masyarakat Kecamatan Cikajang termasuk Desa Mekarjaya.', 'Puskesmas Cikajang nyadiakeun layanan kesehatan utama sareng rujukan pikeun masarakat Kacamatan Cikajang kalebet Desa Mekarjaya.', 'Cikajang Health Center provides primary and referral healthcare for Cikajang District including Mekarjaya.', '[107.8265, -7.3830]', '["https://example.com/images/puskesmas-1.jpg"]', TRUE),

('posyandu-mekarjaya', 2, 'Posyandu Mekarjaya', 'Posyandu Mekarjaya', 'Mekarjaya Integrated Health Post', 'Posyandu Mekarjaya melayani kesehatan ibu dan anak serta imunisasi balita di Desa Mekarjaya.', 'Posyandu Mekarjaya ngalayanan kasehatan ibu sareng anak oge imunisasi balita di Desa Mekarjaya.', 'Mekarjaya Integrated Health Post serves maternal and child health needs.', '[107.8310, -7.3880]', '["https://example.com/images/posyandu-1.jpg"]', FALSE),

-- Kantor Desa
('kantor-desa-mekarjaya', 3, 'Kantor Desa Mekarjaya', 'Kantor Desa Mekarjaya', 'Mekarjaya Village Office', 'Kantor Desa Mekarjaya merupakan pusat administrasi dan pelayanan publik bagi warga Desa Mekarjaya, Kecamatan Cikajang.', 'Kantor Desa Mekarjaya mangrupakeun puseur administrasi sareng palayanan umum pikeun warga Desa Mekarjaya, Kacamatan Cikajang.', 'Mekarjaya Village Office serves as the administrative and public service center for Mekarjaya Village.', '[107.8310, -7.3876]', '["https://example.com/images/kantor-desa-1.jpg"]', TRUE),

('kantor-kecamatan-cikajang', 3, 'Kantor Kecamatan Cikajang', 'Kantor Kacamatan Cikajang', 'Cikajang District Office', 'Kantor Kecamatan Cikajang merupakan pusat pemerintahan tingkat kecamatan yang membawahi 12 desa termasuk Desa Mekarjaya.', 'Kantor Kacamatan Cikajang mangrupakeun puseur pamarentahan tingkat kacamatan anu ngawengku 12 desa kalebet Desa Mekarjaya.', 'Cikajang District Office serves 12 villages including Mekarjaya.', '[107.8260, -7.3800]', '["https://example.com/images/kecamatan-1.jpg"]', FALSE),

-- Tempat Ibadah
('masjid-al-huda', 4, 'Masjid Al-Huda Mekarjaya', 'Masjid Al-Huda Mekarjaya', 'Al-Huda Mosque Mekarjaya', 'Masjid Al-Huda merupakan masjid utama Desa Mekarjaya yang menjadi pusat kegiatan keagamaan dan kemasyarakatan Islam.', 'Masjid Al-Huda mangrupakeun masjid utama Desa Mekarjaya anu jadi puseur kagiatan kaagamaan sareng masarakat Islam.', 'Al-Huda Mosque is the main mosque of Mekarjaya Village serving as the center of Islamic religious and community activities.', '[107.8305, -7.3872]', '["https://example.com/images/masjid-1.jpg"]', TRUE),

('mushola-al-barkah', 4, 'Mushola Al-Barkah', 'Mushola Al-Barkah', 'Al-Barkah Prayer House', 'Mushola Al-Barkah melayani kebutuhan ibadah warga di lingkungan RW 03 Desa Mekarjaya.', 'Mushola Al-Barkah ngalayanan kabutuhan ibadah warga di lingkungan RW 03 Desa Mekarjaya.', 'Al-Barkah Prayer House serves the worship needs of Mekarjaya RW 03 residents.', '[107.8320, -7.3890]', '["https://example.com/images/mushola-1.jpg"]', FALSE),

-- Wisata Alam
('curug-cikajang', 5, 'Curug Cikajang', 'Curug Cikajang', 'Cikajang Waterfall', 'Curug Cikajang adalah air terjun alami yang terletak di kawasan perbukitan Desa Mekarjaya, destinasi wisata alam favorit warga Garut.', 'Curug Cikajang mangrupakeun curug alami anu aya di wewengkon pasir Desa Mekarjaya, tujuan wisata alam favorit warga Garut.', 'Cikajang Waterfall is a natural waterfall in the hills of Mekarjaya, a favorite nature destination.', '[107.8205, -7.3780]', '["https://example.com/images/curug-1.jpg", "https://example.com/images/curug-2.jpg"]', TRUE),

('bukit-panaroma', 5, 'Bukit Panorama Mekarjaya', 'Bukit Panorama Mekarjaya', 'Mekarjaya Panorama Hill', 'Bukit Panorama Mekarjaya menawarkan pemandangan hamparan perkebunan teh dan perbukitan hijau yang indah dari ketinggian.', 'Bukit Panorama Mekarjaya nawiskeun pamandangan kebon teh sareng pasir hejo anu endah ti luhur.', 'Mekarjaya Panorama Hill offers stunning views of tea plantations and green hills.', '[107.8255, -7.3750]', '["https://example.com/images/bukit-1.jpg", "https://example.com/images/bukit-2.jpg"]', TRUE),

-- UMKM
('umkm-opak-mekarjaya', 6, 'UMKM Opak Mekarjaya', 'UMKM Opak Mekarjaya', 'Mekarjaya Opak Crackers MSME', 'UMKM ini memproduksi opak tradisional khas Garut yang renyah dan gurih, bahan baku dari ketan lokal.', 'UMKM ieu ngahasilkeun opak tradisional has Garut anu renceng sareng gurih, bahan baku tina ketan lokal.', 'This MSME produces traditional Garut-style crispy opak crackers from local sticky rice.', '[107.8318, -7.3878]', '["https://example.com/images/umkm-opak-1.jpg"]', TRUE),

('umkm-kopi-garut', 6, 'UMKM Kopi Garut Mekarjaya', 'UMKM Kopi Garut Mekarjaya', 'Mekarjaya Garut Coffee MSME', 'UMKM Kopi Garut mengelola perkebunan kopi arabika dataran tinggi Garut dengan cita rasa khas.', 'UMKM Kopi Garut ngatur perkebunan kopi arabika dataran luhur Garut kalawan rasa has.', 'This MSME manages Arabica coffee plantations of the Garut highlands with distinctive flavor.', '[107.8295, -7.3855]', '["https://example.com/images/umkm-kopi-1.jpg"]', FALSE),

('umkm-batik-garut', 6, 'UMKM Batik Garut Mekarjaya', 'UMKM Batik Garut Mekarjaya', 'Mekarjaya Batik Garut MSME', 'UMKM ini memproduksi batik tulis khas Garut dengan motif alam dan budaya Sunda.', 'UMKM ieu ngahasilkeun batik tulis has Garut kalawan motif alam sareng budaya Sunda.', 'This MSME produces traditional Garut hand-drawn batik with nature and Sundanese motifs.', '[107.8302, -7.3868]', '["https://example.com/images/umkm-batik-1.jpg"]', FALSE),

-- Lapangan
('lapangan-mekarjaya', 7, 'Lapangan Serbaguna Mekarjaya', 'Lapangan Sarwaguna Mekarjaya', 'Mekarjaya Multi-purpose Field', 'Lapangan serbaguna Desa Mekarjaya digunakan untuk olahraga sepak bola, voli, dan acara desa.', 'Lapangan sarwaguna Desa Mekarjaya digunakeun pikeun olahraga bola, voli, sareng acara desa.', 'Mekarjaya multi-purpose field is used for soccer, volleyball, and village events.', '[107.8300, -7.3865]', '["https://example.com/images/lapangan-1.jpg"]', FALSE),

-- Jembatan
('jembatan-cikajang', 8, 'Jembatan Cikajang', 'Jambatan Cikajang', 'Cikajang Bridge', 'Jembatan ini menghubungkan Desa Mekarjaya dengan desa-desa tetangga di wilayah selatan Kecamatan Cikajang.', 'Jambatan ieu ngahubungkeun Desa Mekarjaya sareng desa-desa tatangga di wilayah kidul Kacamatan Cikajang.', 'This bridge connects Mekarjaya with neighboring villages in southern Cikajang District.', '[107.8340, -7.3900]', '["https://example.com/images/jembatan-1.jpg"]', FALSE),

-- Sungai
('sungai-cikajang', 9, 'Sungai Cikajang', 'Walungan Cikajang', 'Cikajang River', 'Sungai Cikajang mengalir melintasi Desa Mekarjaya dan menjadi sumber irigasi utama bagi persawahan dan perkebunan warga.', 'Walungan Cikajang ngamalir nyusul Desa Mekarjaya sareng janten sumber irigasi utama pikeun sawah sareng kebon.', 'Cikajang River flows through Mekarjaya and serves as the main irrigation source for farming.', '[107.8350, -7.3895]', '["https://example.com/images/sungai-1.jpg"]', FALSE),

-- Pasar
('pasar-cikajang', 10, 'Pasar Cikajang', 'Pasar Cikajang', 'Cikajang Market', 'Pasar Cikajang adalah pasar tradisional yang menjadi pusat ekonomi dan perdagangan warga Kecamatan Cikajang dan sekitarnya.', 'Pasar Cikajang mangrupakeun pasar tradisional anu jadi puseur ekonomi sareng perdagangan warga Kacamatan Cikajang.', 'Cikajang Market is a traditional market serving as the economic center of Cikajang District.', '[107.8275, -7.3825]', '["https://example.com/images/pasar-1.jpg", "https://example.com/images/pasar-2.jpg"]', TRUE),

-- Perkebunan
('perkebunan-teh-cikajang', 11, 'Perkebunan Teh Cikajang', 'Perkebunan Teh Cikajang', 'Cikajang Tea Plantation', 'Perkebunan teh di lereng perbukitan Cikajang merupakan salah satu penghasil teh berkualitas tinggi Jawa Barat yang dikelola oleh masyarakat.', 'Perkebunan teh di lereng pasir Cikajang mangrupakeun salah sahiji penghasil teh kualitas luhur Jawa Barat anu dikelola ku masyarakat.', 'Cikajang tea plantations on the hillsides produce high-quality West Java tea managed by the community.', '[107.8220, -7.3720]', '["https://example.com/images/teh-1.jpg", "https://example.com/images/teh-2.jpg"]', TRUE);

SELECT 'Categories:' as info, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Locations:' as info, COUNT(*) as count FROM locations;
