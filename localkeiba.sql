
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `baba` (
  `baba_code` tinyint(4) NOT NULL DEFAULT 0,
  `baba_name` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

REPLACE INTO `baba` (`baba_code`, `baba_name`) VALUES
(1, '北見ば'),
(2, '岩見ば'),
(3, '帯広ば'),
(4, '旭川ば'),
(7, '旭川'),
(8, '札幌'),
(10, '盛岡'),
(11, '水沢'),
(12, '上山'),
(15, '足利'),
(16, '宇都宮'),
(17, '高崎'),
(18, '浦和'),
(19, '船橋'),
(20, '大井'),
(21, '川崎'),
(22, '金沢'),
(23, '笠松'),
(24, '名古屋'),
(25, '中京'),
(27, '園田'),
(28, '姫路'),
(30, '福山'),
(31, '高知'),
(32, '佐賀'),
(33, '荒尾'),
(36, '門別'),
(41, 'ばんえ'),
(42, '北海道'),
(43, '岩手'),
(44, '新潟'),
(45, '北関東'),
(46, '南関東'),
(47, '栃木'),
(48, '東海'),
(49, '愛知'),
(50, '兵庫'),
(61, '九州'),
(80, '全国');

CREATE TABLE `calendar` (
  `race_date` date NOT NULL,
  `venucode` int(11) NOT NULL,
  `venue` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `race_cnt` (
  `id` varchar(10) NOT NULL,
  `cnt` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `baba`
  ADD PRIMARY KEY (`baba_code`);
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`race_date`,`venucode`),
  ADD UNIQUE KEY `race_date` (`race_date`,`venucode`);

ALTER TABLE `race_cnt`
  ADD PRIMARY KEY (`id`);
COMMIT;



CREATE TABLE `race_cnt` (
  `id` varchar(10) NOT NULL,
  `cnt` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `race_card` (
  `id` varchar(12) NOT NULL,
  `frame_number` int not null DEFAULT 0,
  `horse_number` int not null DEFAULT 0,
  `horse_name` text null,
  `sex_age`  text null,
  `hair` text null ,
  `birthyear` tinyint(4) NULL DEFAULT 0,
  `birthymonth` tinyint(2) NULL DEFAULT 0,
  `sire` text null,
  `dam` text null,
  `broodmare_sire` text null,
  `jockey` text null,
  `affiliation` text null,
  `burden_weight` DECIMAL(3,1) NULL ,
  `trainer` text NULL,
  `owner` text NULL,
  `breaeder` text NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;