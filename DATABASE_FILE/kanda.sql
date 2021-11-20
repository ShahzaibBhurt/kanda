-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 12, 2021 at 12:11 PM
-- Server version: 10.3.16-MariaDB
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kanda`
--

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `email` varchar(200) NOT NULL,
  `token_number` varchar(200) NOT NULL,
  `date_time` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `email`, `token_number`, `date_time`) VALUES
(11, 'zohaib@gmail.com', 'a45b3b7655507eeca6a607dd242d2f5768fa2c159fcba6b40caf8485852e8129aef33b4cd86648fa78327323eb2bf36c55a4', 'Sunday-07-February-2021-12:46:16 AM'),
(12, 'abbasitmemon1@gmail.com', '68ce2b6ba21ff5f2212f4e831331a9bf0e5ecd295d9fe5686a6317d957b7a282e18ea61f1f369859d1de5c3b9d61c5d0dc3f', 'Sunday-07-February-2021-12:48:29 AM');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL DEFAULT 'NULL',
  `email` varchar(100) NOT NULL,
  `birthday` date NOT NULL,
  `address` varchar(255) NOT NULL DEFAULT 'NULL',
  `number` bigint(20) NOT NULL,
  `additional_number` bigint(20) DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `question` longtext NOT NULL,
  `answer` varchar(200) NOT NULL,
  `recv_name` varchar(200) NOT NULL,
  `recv_address` varchar(255) NOT NULL,
  `recv_phone` varchar(20) NOT NULL,
  `recv_email` varchar(100) NOT NULL,
  `account_cre_date` date NOT NULL,
  `role` varchar(10) NOT NULL,
  `is_verified` int(11) NOT NULL DEFAULT 0,
  `trn` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `lname`, `email`, `birthday`, `address`, `number`, `additional_number`, `gender`, `password`, `question`, `answer`, `recv_name`, `recv_address`, `recv_phone`, `recv_email`, `account_cre_date`, `role`, `is_verified`, `trn`) VALUES
(17, 'admin', 'wwww', 'admin@gmail.com', '0000-00-00', 'NULLsadasd', 0, NULL, 'Male', '21232f297a57a5a743894a0e4a801fc3', '', '', '', 'dfgdfgdfgf', '', '', '2020-11-26', 'admin', 1, '123456789'),
(25, 'Shahzaib', 'Bhurt', 's.bhurt786@gmail.com', '2021-01-09', 'NULLsadasd', 3012543002, 0, 'Male', 'a21075a36eeddd084e17611a238c7101', '', '', 'a', 'dfgdfgdfgf', 'a', 'a', '2021-01-24', 'user', 0, '12345'),
(39, 'Imtiaz Ahmed1', 'Sanai1', 'aliimtiazsanai@gmail.com1', '1996-09-01', 'NULLsadasd', 89797979797971, 989879797971, 'Male', '827ccb0eea8a706c4c34a16891f84e7b', 'What school were you in at age 10?', 'Primary school', 'Shahxaib1', 'dfgdfgdfgf', '09809808081', 'ali@gmail.com1', '2021-02-03', 'user', 1, '123456789'),
(42, 'editor', 'NULL', 'shazaibbhurt@gmail.com', '0000-00-00', 'NULLsadasd', 0, NULL, 'Male', 'eb54f2d70e66240fb2e438f9ad9120fb', '', '', '', 'dfgdfgdfgf', '', '', '0000-00-00', 'user', 1, '123456789'),
(44, 'ab basit', 'memon', 'abbasitmemon1@gmail.com', '1996-12-01', 'NULLsadasd', 3120213241, 3012543002, 'Male', 'fa29dd19c7c4d7bb594c70a5de02f814', 'What is your favorite food?', 'banana', 'Shahzaib Bhurt', 'dfgdfgdfgf', '03012543002', 'shazaibbhurt@gmail.com', '2021-02-06', 'user', 0, '123456789'),
(46, 'viewer', 'NULL', 'viewer@gmail.com', '0000-00-00', 'NULLsadasd', 0, NULL, 'Male', '4b2a1529867b8d697685b1722ccd0149', '', '', '', 'dfgdfgdfgf', '', '', '0000-00-00', 'viewer', 1, '123456789'),
(47, 'subadmin', 'NULL', 'subadmin@gmail.com', '0000-00-00', 'NULLsadasd', 0, NULL, 'Male', '21232f297a57a5a743894a0e4a801fc3', '', '', '', 'dfgdfgdfgf', '', '', '0000-00-00', 'subadmin', 1, '123456789');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
