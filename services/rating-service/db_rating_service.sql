-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2026 at 12:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_rating_service`
--

-- --------------------------------------------------------

--
-- Table structure for table `aspek_penilaian`
--

CREATE TABLE `aspek_penilaian` (
  `id` int(11) NOT NULL,
  `nama_aspek` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aspek_penilaian`
--

INSERT INTO `aspek_penilaian` (`id`, `nama_aspek`) VALUES
(1, 'Kecepatan Penanganan'),
(2, 'Kualitas Solusi'),
(3, 'Sikap Petugas');

-- --------------------------------------------------------

--
-- Table structure for table `rating_details`
--

CREATE TABLE `rating_details` (
  `id` int(11) NOT NULL,
  `id_rating_header` int(11) NOT NULL,
  `id_aspek` int(11) NOT NULL,
  `id_skala` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rating_headers`
--

CREATE TABLE `rating_headers` (
  `id` int(11) NOT NULL,
  `id_pengaduan` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `komentar_tambahan` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skala_rating`
--

CREATE TABLE `skala_rating` (
  `id` int(11) NOT NULL,
  `keterangan` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skala_rating`
--

INSERT INTO `skala_rating` (`id`, `keterangan`) VALUES
(1, 'Sangat Buruk'),
(2, 'Buruk'),
(3, 'Cukup'),
(4, 'Baik'),
(5, 'Sangat Baik');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aspek_penilaian`
--
ALTER TABLE `aspek_penilaian`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rating_details`
--
ALTER TABLE `rating_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rating_header` (`id_rating_header`),
  ADD KEY `id_aspek` (`id_aspek`),
  ADD KEY `id_skala` (`id_skala`);

--
-- Indexes for table `rating_headers`
--
ALTER TABLE `rating_headers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skala_rating`
--
ALTER TABLE `skala_rating`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aspek_penilaian`
--
ALTER TABLE `aspek_penilaian`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rating_details`
--
ALTER TABLE `rating_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `rating_headers`
--
ALTER TABLE `rating_headers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rating_details`
--
ALTER TABLE `rating_details`
  ADD CONSTRAINT `rating_details_ibfk_1` FOREIGN KEY (`id_rating_header`) REFERENCES `rating_headers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rating_details_ibfk_2` FOREIGN KEY (`id_aspek`) REFERENCES `aspek_penilaian` (`id`),
  ADD CONSTRAINT `rating_details_ibfk_3` FOREIGN KEY (`id_skala`) REFERENCES `skala_rating` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
