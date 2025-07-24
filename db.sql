-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Počítač: db
-- Vytvořeno: Čtv 24. čec 2025, 14:03
-- Verze serveru: 9.2.0
-- Verze PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `test`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `answers`
--

CREATE TABLE `answers` (
  `id` int NOT NULL,
  `id_question` int NOT NULL,
  `answer` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `answers`
--

INSERT INTO `answers` (`id`, `id_question`, `answer`) VALUES
(28, 21, 'Praha'),
(29, 21, 'Olomouc'),
(30, 21, 'Brno'),
(31, 22, 'Ano'),
(32, 22, 'Ne');

-- --------------------------------------------------------

--
-- Struktura tabulky `badges_bulk_messages`
--

CREATE TABLE `badges_bulk_messages` (
  `id` int NOT NULL,
  `id_bulk_message` int NOT NULL,
  `id_user` int NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `badges_posts`
--

CREATE TABLE `badges_posts` (
  `id` int NOT NULL,
  `id_post` int NOT NULL,
  `id_user` int NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `badges_questions`
--

CREATE TABLE `badges_questions` (
  `id` int NOT NULL,
  `id_question` int NOT NULL,
  `id_user` int NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `badges_questions`
--

INSERT INTO `badges_questions` (`id`, `id_question`, `id_user`, `time`) VALUES
(1, 22, 10, '2025-07-24 13:29:42');

-- --------------------------------------------------------

--
-- Struktura tabulky `boards`
--

CREATE TABLE `boards` (
  `id` int NOT NULL,
  `id_picture` int NOT NULL,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `archived` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `boards`
--

INSERT INTO `boards` (`id`, `id_picture`, `name`, `archived`) VALUES
(34, 1, '1. Rok', NULL),
(35, 2, '2. Rok', NULL),
(36, 5, 'Kroužek', NULL),
(37, 3, 'Škola v přírodě', NULL),
(38, 4, 'Výlet', NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `board_pictures`
--

CREATE TABLE `board_pictures` (
  `id` int NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Vypisuji data pro tabulku `board_pictures`
--

INSERT INTO `board_pictures` (`id`, `path`, `url`) VALUES
(1, '/private/boards/thumbnails/board-1.jpg', '/api/dashboard/add-board/pictures/1/source'),
(2, '/private/boards/thumbnails/board-2.jpg', '/api/dashboard/add-board/pictures/2/source'),
(3, '/private/boards/thumbnails/board-3.jpg', '/api/dashboard/add-board/pictures/3/source'),
(4, '/private/boards/thumbnails/board-4.jpg', '/api/dashboard/add-board/pictures/4/source'),
(5, '/private/boards/thumbnails/board-5.jpg', '/api/dashboard/add-board/pictures/5/source'),
(6, '/private/boards/thumbnails/board-6.jpg', '/api/dashboard/add-board/pictures/6/source');

-- --------------------------------------------------------

--
-- Struktura tabulky `board_sections`
--

CREATE TABLE `board_sections` (
  `id` int NOT NULL,
  `id_board` int NOT NULL,
  `id_section` int NOT NULL,
  `archived` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `board_sections`
--

INSERT INTO `board_sections` (`id`, `id_board`, `id_section`, `archived`) VALUES
(59, 34, 1, NULL),
(60, 34, 2, NULL),
(61, 34, 3, NULL),
(62, 35, 4, NULL),
(63, 36, 8, NULL),
(64, 36, 9, NULL),
(65, 37, 6, NULL),
(68, 38, 7, NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `bulk_messages`
--

CREATE TABLE `bulk_messages` (
  `id` int NOT NULL,
  `id_sender` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `attachment_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci DEFAULT NULL,
  `attachment_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_czech_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `bulk_messages`
--

INSERT INTO `bulk_messages` (`id`, `id_sender`, `name`, `message`, `time`, `attachment_name`, `attachment_path`, `url`) VALUES
(31, 10, 'Výlet 23. 6.', 'Dobrý den, dne 23. 6. pojedeme na výlet do Prahy, zabalte dětem pláštěnky a svačiny s pitím na celý den. Cena bude 500 Kč.', '2025-07-24 08:59:17', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `conversations`
--

CREATE TABLE `conversations` (
  `id` int NOT NULL,
  `id_teacher` int NOT NULL,
  `id_parent` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `conversations`
--

INSERT INTO `conversations` (`id`, `id_teacher`, `id_parent`) VALUES
(7, 10, 284),
(8, 10, 285),
(9, 10, 286);

-- --------------------------------------------------------

--
-- Struktura tabulky `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `id_conversation` int NOT NULL,
  `id_sender` int NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci,
  `attachment_name` varchar(255) COLLATE utf8mb4_czech_ci DEFAULT NULL,
  `attachment_path` varchar(255) COLLATE utf8mb4_czech_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_czech_ci DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `badge_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `messages`
--

INSERT INTO `messages` (`id`, `id_conversation`, `id_sender`, `message`, `attachment_name`, `attachment_path`, `url`, `time`, `badge_time`) VALUES
(59, 7, 10, 'Dobrý den, stavte se prosím za mnou v 14:30. Děkuji', NULL, NULL, NULL, '2025-07-24 10:36:15', NULL),
(60, 7, 10, '', 'test.pdf', '/private/attachments/3b5bf20f-3fd7-4f7b-93d4-029215a1428a.pdf', '/api/conversations/7/60/source', '2025-07-24 10:36:26', NULL),
(61, 8, 10, 'Můžete poslat po synovi prosím omluvenku z 21. 4.?', NULL, NULL, NULL, '2025-07-24 10:38:18', NULL),
(62, 9, 10, 'Dobrý den, můžu vás poprosit o laskavost?', NULL, NULL, NULL, '2025-07-24 10:40:11', NULL),
(65, 9, 10, 'Potřebovali bychom pomoc na den dětí.', NULL, NULL, NULL, '2025-07-24 10:45:46', NULL),
(67, 7, 284, 'Dobrý den, děkuji moc, stavím se.', NULL, NULL, NULL, '2025-07-24 11:12:11', NULL),
(68, 8, 285, 'Ano', NULL, NULL, NULL, '2025-07-24 11:18:15', NULL),
(69, 9, 286, 'Dobrý den, velmi ráda vám pomohu.', NULL, NULL, NULL, '2025-07-24 11:22:38', '2025-07-24 13:29:42');

-- --------------------------------------------------------

--
-- Struktura tabulky `photo_gallery`
--

CREATE TABLE `photo_gallery` (
  `id` int NOT NULL,
  `id_post` int NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_czech_ci NOT NULL,
  `thumbnail_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `thumbnail_url` varchar(255) COLLATE utf8mb4_czech_ci NOT NULL,
  `thumbnail_width` int NOT NULL,
  `thumbnail_height` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `photo_gallery`
--

INSERT INTO `photo_gallery` (`id`, `id_post`, `path`, `url`, `thumbnail_path`, `thumbnail_url`, `thumbnail_width`, `thumbnail_height`) VALUES
(67, 85, '/private/boards/36/63/85/35aca615-14a3-495b-8779-dd3c04f9aa9b.jpg', '/api/dashboard/36/63/photo-gallery/photos/67/source', '/private/boards/36/63/85/thumbnails/35aca615-14a3-495b-8779-dd3c04f9aa9b.jpg', '/api/dashboard/36/63/photo-gallery/thumbnails/67/source', 1280, 853),
(68, 85, '/private/boards/36/63/85/6b6fc264-2edd-4798-ba15-ae6967bc1dc5.jpg', '/api/dashboard/36/63/photo-gallery/photos/68/source', '/private/boards/36/63/85/thumbnails/6b6fc264-2edd-4798-ba15-ae6967bc1dc5.jpg', '/api/dashboard/36/63/photo-gallery/thumbnails/68/source', 1280, 854),
(69, 85, '/private/boards/36/63/85/5806c3de-0a07-4334-b1a0-35f7e07c599a.jpg', '/api/dashboard/36/63/photo-gallery/photos/69/source', '/private/boards/36/63/85/thumbnails/5806c3de-0a07-4334-b1a0-35f7e07c599a.jpg', '/api/dashboard/36/63/photo-gallery/thumbnails/69/source', 1280, 853),
(70, 85, '/private/boards/36/63/85/9f75d7f7-6618-4e5a-b8f8-6b275734a5ba.jpg', '/api/dashboard/36/63/photo-gallery/photos/70/source', '/private/boards/36/63/85/thumbnails/9f75d7f7-6618-4e5a-b8f8-6b275734a5ba.jpg', '/api/dashboard/36/63/photo-gallery/thumbnails/70/source', 1280, 853),
(71, 85, '/private/boards/36/63/85/5cbb6cdb-60a5-4f5c-b7a2-4b6c87675fbd.jpg', '/api/dashboard/36/63/photo-gallery/photos/71/source', '/private/boards/36/63/85/thumbnails/5cbb6cdb-60a5-4f5c-b7a2-4b6c87675fbd.jpg', '/api/dashboard/36/63/photo-gallery/thumbnails/71/source', 1280, 853),
(72, 85, '/private/boards/36/63/85/c9fbd2ee-4986-4ca8-b613-4da6cfc5c966.jpg', '/api/dashboard/36/63/photo-gallery/photos/72/source', '/private/boards/36/63/85/thumbnails/c9fbd2ee-4986-4ca8-b613-4da6cfc5c966.jpg', '/api/dashboard/36/63/photo-gallery/thumbnails/72/source', 1280, 850),
(73, 86, '/private/boards/37/65/86/7475635a-e430-493c-a856-c9667cbedc63.jpg', '/api/dashboard/37/65/photo-gallery/photos/73/source', '/private/boards/37/65/86/thumbnails/7475635a-e430-493c-a856-c9667cbedc63.jpg', '/api/dashboard/37/65/photo-gallery/thumbnails/73/source', 1280, 853),
(74, 86, '/private/boards/37/65/86/6f917e02-f359-478c-a8a8-48c05f57507f.jpg', '/api/dashboard/37/65/photo-gallery/photos/74/source', '/private/boards/37/65/86/thumbnails/6f917e02-f359-478c-a8a8-48c05f57507f.jpg', '/api/dashboard/37/65/photo-gallery/thumbnails/74/source', 1280, 960),
(75, 86, '/private/boards/37/65/86/e7876f00-7f68-4838-9e07-f4c8e5f9cbf0.jpg', '/api/dashboard/37/65/photo-gallery/photos/75/source', '/private/boards/37/65/86/thumbnails/e7876f00-7f68-4838-9e07-f4c8e5f9cbf0.jpg', '/api/dashboard/37/65/photo-gallery/thumbnails/75/source', 1280, 853);

-- --------------------------------------------------------

--
-- Struktura tabulky `posts`
--

CREATE TABLE `posts` (
  `id` int NOT NULL,
  `id_section` int NOT NULL,
  `type` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `thumbnail_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `thumbnail_url` varchar(255) COLLATE utf8mb4_czech_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `archived` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `posts`
--

INSERT INTO `posts` (`id`, `id_section`, `type`, `name`, `thumbnail_path`, `thumbnail_url`, `path`, `url`, `time`, `archived`) VALUES
(77, 59, 'text', 'Lorem Ipsum', '/private/boards/sections/posts/thumbnails/text.png', '/api/dashboard/34/59/77/source', 'C:\\Users\\smajmi00\\Documents\\22-07-2025\\dsd\\14-07-2025\\bp\\bakalarska-prace\\private\\boards\\34\\59\\77\\ec531d66-24fd-4aee-b88f-7f9d8b1d704a.json', '', '2025-07-24 10:07:17', NULL),
(79, 60, 'pdf', 'Příklady', '/private/boards/sections/posts/thumbnails/pdf.jpg', '/api/dashboard/34/60/79/source', '/private/boards/34/60/79/de1ce9b5-a45c-4089-8ae7-cb5a2a822790.pdf', '/api/dashboard/34/60/pdf/79/source', '2025-07-24 10:10:23', NULL),
(80, 61, 'file', 'Domácí úkol 1', '/private/boards/sections/posts/thumbnails/file.png', '/api/dashboard/34/61/80/source', '/private/boards/34/61/80/f60335dc-42ba-470a-ba92-b475bc389cb8.pdf', '/api/dashboard/34/61/file/80/source', '2025-07-24 10:10:46', NULL),
(82, 62, 'text', 'Slovíčka', '/private/boards/sections/posts/thumbnails/text.png', '/api/dashboard/35/62/82/source', 'C:\\Users\\smajmi00\\Documents\\22-07-2025\\dsd\\14-07-2025\\bp\\bakalarska-prace\\private\\boards\\35\\62\\82\\48160724-edb5-4c3c-aac1-6b7151c09798.json', '', '2025-07-24 10:11:19', NULL),
(83, 64, 'audio', 'Hans Zimmer - Time', '/private/boards/sections/posts/thumbnails/audio.jpg', '/api/dashboard/36/64/83/source', '/private/boards/36/64/83/97bd563e-e4b2-4bd8-93a2-78e912620b85.mp3', '/api/dashboard/36/64/audio/83/source', '2025-07-24 10:12:04', NULL),
(85, 63, 'photo', 'Kreslení', '/private/boards/36/63/85/thumbnail/fc2aa764-a244-4567-bf3c-a8ee878989c4.jpg', '/api/dashboard/36/63/85/source', NULL, NULL, '2025-07-24 10:15:57', NULL),
(86, 65, 'photo', 'Praha', '/private/boards/37/65/86/thumbnail/bde47037-643b-484a-a4fb-fa16cefca170.jpg', '/api/dashboard/37/65/86/source', NULL, NULL, '2025-07-24 10:18:00', NULL),
(90, 68, 'video', 'Z lesa ptáček', '/private/boards/sections/posts/thumbnails/video.webp', '/api/dashboard/38/68/90/source', '/private/boards/38/68/90/2347ca6e-a2e5-42c8-a498-e3f24b22b6ad.mp4', '/api/dashboard/38/68/video/90/source', '2025-07-24 10:32:18', NULL),
(91, 59, 'text', 'Učebnice 1', '/private/boards/sections/posts/thumbnails/text.png', '/api/dashboard/34/59/91/source', 'C:\\Users\\smajmi00\\Documents\\22-07-2025\\dsd\\14-07-2025\\bp\\bakalarska-prace\\private\\boards\\34\\59\\91\\dc9e1183-b948-4425-9dc2-c7fef044e6be.json', '', '2025-07-24 10:33:03', NULL),
(92, 59, 'text', 'Učebnice 2', '/private/boards/sections/posts/thumbnails/text.png', '/api/dashboard/34/59/92/source', 'C:\\Users\\smajmi00\\Documents\\22-07-2025\\dsd\\14-07-2025\\bp\\bakalarska-prace\\private\\boards\\34\\59\\92\\3942b45c-1f5b-4a7f-8caf-9cf5618c35f9.json', '', '2025-07-24 10:33:13', NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `questions`
--

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `question` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `questions`
--

INSERT INTO `questions` (`id`, `question`, `time`) VALUES
(21, 'Vaše oblíbené město?', '2025-07-24 10:04:27'),
(22, 'Zůčastníte se třídních schůzek?', '2025-07-24 10:04:45');

-- --------------------------------------------------------

--
-- Struktura tabulky `sections`
--

CREATE TABLE `sections` (
  `id` int NOT NULL,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci DEFAULT NULL,
  `checked` tinyint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `sections`
--

INSERT INTO `sections` (`id`, `name`, `path`, `url`, `checked`) VALUES
(1, 'Český jazyk', '/private/boards/sections/thumbnails/cesky-jazyk.jpg', '/api/dashboard/add-board/sections/1/source', 0),
(2, 'Matematika', '/private/boards/sections/thumbnails/matematika.jpg', '/api/dashboard/add-board/sections/2/source', 0),
(3, 'Domácí úkoly', '/private/boards/sections/thumbnails/domaci-ukoly.jpg', '/api/dashboard/add-board/sections/3/source', 0),
(4, 'Anglický jazyk', '/private/boards/sections/thumbnails/anglicky-jazyk.jpg', '/api/dashboard/add-board/sections/4/source', 0),
(5, 'Informatika', '/private/boards/sections/thumbnails/informatika.jpg', '/api/dashboard/add-board/sections/5/source', 0),
(6, 'Vlastivěda', '/private/boards/sections/thumbnails/vlastiveda.jpg', '/api/dashboard/add-board/sections/6/source', 0),
(7, 'Přírodověda', '/private/boards/sections/thumbnails/prirodoveda.jpg', '/api/dashboard/add-board/sections/7/source', 0),
(8, 'Výtvarná výchova', '/private/boards/sections/thumbnails/vytvarna-vychova.jpg', '/api/dashboard/add-board/sections/8/source', 0),
(9, 'Hudební výchova', '/private/boards/sections/thumbnails/hudebni-vychova.jpg', '/api/dashboard/add-board/sections/9/source', 0),
(10, 'Tělesná výchova', '/private/boards/sections/thumbnails/telesna-vychova.jpg', '/api/dashboard/add-board/sections/10/source', 0);

-- --------------------------------------------------------

--
-- Struktura tabulky `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `firstname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `surname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `role` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `token` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Vypisuji data pro tabulku `users`
--

INSERT INTO `users` (`id`, `path`, `url`, `firstname`, `surname`, `email`, `password`, `phone`, `role`, `token`) VALUES
(10, '/private/profile-photo/794f8209-3ee5-417c-b2af-c87d3c71eb97.png', '/api/account/profile-photo/10/source', 'Virtualní', 'Nástěnka', 'teacher@virtualninastenka.com', '$2b$10$u0ZfJReXB53YHojo.kYkSuDip2yirDaqYwJwApGTwMsiJzcZf6QLq', '785 125 478', 'teacher', NULL),
(284, '/private/profile-photo/8c7b1aa2-6004-4dee-b37f-d744253210da.png', '/api/account/profile-photo/284/source', 'Petr', 'Novák', 'petr.novak@gmail.com', '$2b$10$hbM7AD3lHkgE1R9YvkxehOP6YWbNQVkgo7GkACd1o338WumAsXnHi', '+420 789 456 123', 'user', NULL),
(285, '/private/profile-photo/13510478-f4fd-419c-9104-6a658ef9f2fa.png', '/api/account/profile-photo/285/source', 'Jan', 'Novotný', 'novotny@centrum.cz', '$2b$10$9u1MrOlxFKOkXpWk/c4EZeaWtCEFfqCTU.xYWBryi0Nnz/0YlQAFy', '+420 789 654 321', 'user', NULL),
(286, '/private/profile-photo/abbfed6c-d328-4e57-bbd7-791d993b3cf1.png', '/api/account/profile-photo/286/source', 'Alena', 'Veselá', 'vesela@seznam.cz', '$2b$10$D6GFXwC2tzSQpmjMbeJkPeum1pf6QziLUBUqwd0vyvk0RBO1Y.dJa', '+420 789 456 123', 'user', NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `user_answers`
--

CREATE TABLE `user_answers` (
  `id` int NOT NULL,
  `id_question` int NOT NULL,
  `id_answer` int NOT NULL,
  `id_user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `user_answers`
--

INSERT INTO `user_answers` (`id`, `id_question`, `id_answer`, `id_user`) VALUES
(1, 22, 31, 284),
(2, 21, 29, 284),
(3, 22, 31, 285),
(4, 21, 30, 285),
(5, 22, 31, 286),
(6, 21, 28, 286);

--
-- Indexy pro exportované tabulky
--

--
-- Indexy pro tabulku `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_question` (`id_question`);

--
-- Indexy pro tabulku `badges_bulk_messages`
--
ALTER TABLE `badges_bulk_messages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_key` (`id_bulk_message`,`id_user`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexy pro tabulku `badges_posts`
--
ALTER TABLE `badges_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_key` (`id_post`,`id_user`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexy pro tabulku `badges_questions`
--
ALTER TABLE `badges_questions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_key` (`id_question`,`id_user`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexy pro tabulku `boards`
--
ALTER TABLE `boards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `index_boards` (`name`) USING BTREE,
  ADD KEY `id_picture` (`id_picture`);

--
-- Indexy pro tabulku `board_pictures`
--
ALTER TABLE `board_pictures`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `board_sections`
--
ALTER TABLE `board_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_board` (`id_board`),
  ADD KEY `id_section` (`id_section`);

--
-- Indexy pro tabulku `bulk_messages`
--
ALTER TABLE `bulk_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_teacher` (`id_teacher`),
  ADD KEY `id_parent` (`id_parent`);

--
-- Indexy pro tabulku `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_conversation` (`id_conversation`),
  ADD KEY `id_sender` (`id_sender`);

--
-- Indexy pro tabulku `photo_gallery`
--
ALTER TABLE `photo_gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_post` (`id_post`);

--
-- Indexy pro tabulku `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `index_posts` (`name`) USING BTREE,
  ADD KEY `id_section` (`id_section`);

--
-- Indexy pro tabulku `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `index_sections` (`name`);

--
-- Indexy pro tabulku `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexy pro tabulku `user_answers`
--
ALTER TABLE `user_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_question` (`id_question`),
  ADD KEY `id_answer` (`id_answer`),
  ADD KEY `id_user` (`id_user`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pro tabulku `badges_bulk_messages`
--
ALTER TABLE `badges_bulk_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pro tabulku `badges_posts`
--
ALTER TABLE `badges_posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pro tabulku `badges_questions`
--
ALTER TABLE `badges_questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pro tabulku `boards`
--
ALTER TABLE `boards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT pro tabulku `board_pictures`
--
ALTER TABLE `board_pictures`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT pro tabulku `board_sections`
--
ALTER TABLE `board_sections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT pro tabulku `bulk_messages`
--
ALTER TABLE `bulk_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pro tabulku `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pro tabulku `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT pro tabulku `photo_gallery`
--
ALTER TABLE `photo_gallery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT pro tabulku `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT pro tabulku `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pro tabulku `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pro tabulku `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=288;

--
-- AUTO_INCREMENT pro tabulku `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `badges_bulk_messages`
--
ALTER TABLE `badges_bulk_messages`
  ADD CONSTRAINT `badges_bulk_messages_ibfk_1` FOREIGN KEY (`id_bulk_message`) REFERENCES `bulk_messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `badges_bulk_messages_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `badges_posts`
--
ALTER TABLE `badges_posts`
  ADD CONSTRAINT `badges_posts_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `badges_posts_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `badges_questions`
--
ALTER TABLE `badges_questions`
  ADD CONSTRAINT `badges_questions_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `badges_questions_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `boards`
--
ALTER TABLE `boards`
  ADD CONSTRAINT `boards_ibfk_1` FOREIGN KEY (`id_picture`) REFERENCES `board_pictures` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `board_sections`
--
ALTER TABLE `board_sections`
  ADD CONSTRAINT `board_sections_ibfk_1` FOREIGN KEY (`id_board`) REFERENCES `boards` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `board_sections_ibfk_2` FOREIGN KEY (`id_section`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`id_teacher`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`id_parent`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`id_conversation`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`id_sender`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `photo_gallery`
--
ALTER TABLE `photo_gallery`
  ADD CONSTRAINT `photo_gallery_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`id_section`) REFERENCES `board_sections` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `user_answers`
--
ALTER TABLE `user_answers`
  ADD CONSTRAINT `user_answers_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_answers_ibfk_2` FOREIGN KEY (`id_answer`) REFERENCES `answers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_answers_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
