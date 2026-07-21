-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 19 juil. 2026 à 18:35
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `voxlingo_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `lessons`
--

CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `language` varchar(255) NOT NULL,
  `level` enum('débutant','intermédiaire','avancé') NOT NULL,
  `theme` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `lessons`
--

INSERT INTO `lessons` (`id`, `language`, `level`, `theme`, `title`, `image_url`, `order_index`, `created_at`, `updated_at`) VALUES
(1, 'anglais', 'débutant', 'alphabet', 'Alphabet anglais', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'anglais', 'débutant', 'salutations', 'Se presenter', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'anglais', 'débutant', 'chiffres', 'Compter en anglais', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400', 3, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 'anglais', 'débutant', 'couleurs', 'Les couleurs', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400', 4, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'anglais', 'débutant', 'nourriture', 'Au restaurant', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', 5, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, 'anglais', 'intermédiaire', 'voyage', 'A laeroport', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400', 6, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(7, 'anglais', 'intermédiaire', 'shopping', 'Faire du shopping', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', 7, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 'anglais', 'avancé', 'travail', 'Entretien dembauche', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', 8, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 'espagnol', 'débutant', 'alphabet', 'El alfabeto espanol', 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=400', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(10, 'espagnol', 'débutant', 'salutations', 'Presentarse', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(11, 'espagnol', 'débutant', 'chiffres', 'Los numeros', 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400', 3, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(12, 'espagnol', 'débutant', 'couleurs', 'Los colores', 'https://images.unsplash.com/photo-1567095761054-7a6e89f3a5a4?w=400', 4, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(13, 'espagnol', 'débutant', 'nourriture', 'En el restaurante', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 5, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 'espagnol', 'intermédiaire', 'voyage', 'En el aeropuerto', 'https://images.unsplash.com/photo-1583421412574-628976d68eef?w=400', 6, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 'espagnol', 'intermédiaire', 'shopping', 'De compras', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400', 7, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 'espagnol', 'avancé', 'travail', 'Entrevista de trabajo', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400', 8, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 'japonais', 'débutant', 'hiragana', 'Hiragana', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 'japonais', 'débutant', 'katakana', 'Katakana', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, 'japonais', 'débutant', 'salutations', 'Se presenter', 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400', 3, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, 'japonais', 'débutant', 'chiffres', 'Compter en japonais', 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400', 4, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, 'japonais', 'débutant', 'nourriture', 'Au restaurant', 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=400', 5, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 'japonais', 'intermédiaire', 'voyage', 'A la gare', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400', 6, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 'japonais', 'intermédiaire', 'shopping', 'Faire les courses', 'https://images.unsplash.com/photo-1549693578-d683be1e4ee8?w=400', 7, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, 'japonais', 'avancé', 'travail', 'Au bureau', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400', 8, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(25, 'allemand', 'débutant', 'alphabet', 'Das deutsche Alphabet', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(26, 'allemand', 'débutant', 'salutations', 'Sich vorstellen', 'https://images.unsplash.com/photo-1527864550417-7fd91d51d5c6?w=400', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, 'allemand', 'débutant', 'chiffres', 'Die Zahlen', 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400', 3, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, 'allemand', 'débutant', 'nourriture', 'Im Restaurant', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', 4, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, 'allemand', 'intermédiaire', 'voyage', 'Am Flughafen', 'https://images.unsplash.com/photo-1451471016731-e963a8588be7?w=400', 5, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 'allemand', 'intermédiaire', 'shopping', 'Einkaufen gehen', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400', 6, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 'italien', 'débutant', 'alphabet', 'Alfabeto italiano', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, 'italien', 'débutant', 'salutations', 'Presentarsi', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, 'italien', 'débutant', 'chiffres', 'I numeri', 'https://images.unsplash.com/photo-1502570149819-b2260483d302?w=400', 3, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(34, 'italien', 'débutant', 'nourriture', 'Al ristorante', 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400', 4, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(35, 'italien', 'intermédiaire', 'voyage', 'In aeroporto', 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=400', 5, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(36, 'italien', 'intermédiaire', 'shopping', 'Fare shopping', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', 6, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `phrases`
--

CREATE TABLE `phrases` (
  `id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `text_target` varchar(255) NOT NULL,
  `text_translation` varchar(255) NOT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `phrases`
--

INSERT INTO `phrases` (`id`, `lesson_id`, `text_target`, `text_translation`, `order_index`, `created_at`) VALUES
(1, 1, 'A is for Apple', 'A comme Apple (pomme)', 1, '0000-00-00 00:00:00'),
(2, 1, 'B is for Book', 'B comme Book (livre)', 2, '0000-00-00 00:00:00'),
(3, 1, 'C is for Cat', 'C comme Cat (chat)', 3, '0000-00-00 00:00:00'),
(4, 1, 'D is for Dog', 'D comme Dog (chien)', 4, '0000-00-00 00:00:00'),
(5, 1, 'E is for Elephant', 'E comme Elephant (elephant)', 5, '0000-00-00 00:00:00'),
(6, 1, 'F is for Fish', 'F comme Fish (poisson)', 6, '0000-00-00 00:00:00'),
(7, 1, 'G is for Garden', 'G comme Garden (jardin)', 7, '0000-00-00 00:00:00'),
(8, 1, 'H is for House', 'H comme House (maison)', 8, '0000-00-00 00:00:00'),
(9, 1, 'I is for Ice cream', 'I comme Ice cream (glace)', 9, '0000-00-00 00:00:00'),
(10, 1, 'J is for Jungle', 'J comme Jungle (jungle)', 10, '0000-00-00 00:00:00'),
(11, 1, 'K is for King', 'K comme King (roi)', 11, '0000-00-00 00:00:00'),
(12, 1, 'L is for Lion', 'L comme Lion (lion)', 12, '0000-00-00 00:00:00'),
(13, 1, 'M is for Moon', 'M comme Moon (lune)', 13, '0000-00-00 00:00:00'),
(14, 1, 'N is for Night', 'N comme Night (nuit)', 14, '0000-00-00 00:00:00'),
(15, 1, 'O is for Ocean', 'O comme Ocean (ocean)', 15, '0000-00-00 00:00:00'),
(16, 1, 'P is for Penguin', 'P comme Penguin (pingouin)', 16, '0000-00-00 00:00:00'),
(17, 1, 'Q is for Queen', 'Q comme Queen (reine)', 17, '0000-00-00 00:00:00'),
(18, 1, 'R is for Rainbow', 'R comme Rainbow (arc-en-ciel)', 18, '0000-00-00 00:00:00'),
(19, 1, 'S is for Sun', 'S comme Sun (soleil)', 19, '0000-00-00 00:00:00'),
(20, 1, 'T is for Tree', 'T comme Tree (arbre)', 20, '0000-00-00 00:00:00'),
(21, 1, 'U is for Umbrella', 'U comme Umbrella (parapluie)', 21, '0000-00-00 00:00:00'),
(22, 1, 'V is for Violin', 'V comme Violin (violon)', 22, '0000-00-00 00:00:00'),
(23, 1, 'W is for Water', 'W comme Water (eau)', 23, '0000-00-00 00:00:00'),
(24, 1, 'X is for Xylophone', 'X comme Xylophone', 24, '0000-00-00 00:00:00'),
(25, 1, 'Y is for Yellow', 'Y comme Yellow (jaune)', 25, '0000-00-00 00:00:00'),
(26, 1, 'Z is for Zebra', 'Z comme Zebra (zebre)', 26, '0000-00-00 00:00:00'),
(27, 1, 'A is for Apple', 'A comme Apple (pomme)', 1, '0000-00-00 00:00:00'),
(28, 1, 'B is for Book', 'B comme Book (livre)', 2, '0000-00-00 00:00:00'),
(29, 1, 'C is for Cat', 'C comme Cat (chat)', 3, '0000-00-00 00:00:00'),
(30, 1, 'D is for Dog', 'D comme Dog (chien)', 4, '0000-00-00 00:00:00'),
(31, 1, 'E is for Elephant', 'E comme Elephant (elephant)', 5, '0000-00-00 00:00:00'),
(32, 1, 'F is for Fish', 'F comme Fish (poisson)', 6, '0000-00-00 00:00:00'),
(33, 1, 'G is for Garden', 'G comme Garden (jardin)', 7, '0000-00-00 00:00:00'),
(34, 1, 'H is for House', 'H comme House (maison)', 8, '0000-00-00 00:00:00'),
(35, 1, 'I is for Ice cream', 'I comme Ice cream (glace)', 9, '0000-00-00 00:00:00'),
(36, 1, 'J is for Jungle', 'J comme Jungle (jungle)', 10, '0000-00-00 00:00:00'),
(37, 1, 'K is for King', 'K comme King (roi)', 11, '0000-00-00 00:00:00'),
(38, 1, 'L is for Lion', 'L comme Lion (lion)', 12, '0000-00-00 00:00:00'),
(39, 1, 'M is for Moon', 'M comme Moon (lune)', 13, '0000-00-00 00:00:00'),
(40, 1, 'N is for Night', 'N comme Night (nuit)', 14, '0000-00-00 00:00:00'),
(41, 1, 'O is for Ocean', 'O comme Ocean (ocean)', 15, '0000-00-00 00:00:00'),
(42, 1, 'P is for Penguin', 'P comme Penguin (pingouin)', 16, '0000-00-00 00:00:00'),
(43, 1, 'Q is for Queen', 'Q comme Queen (reine)', 17, '0000-00-00 00:00:00'),
(44, 1, 'R is for Rainbow', 'R comme Rainbow (arc-en-ciel)', 18, '0000-00-00 00:00:00'),
(45, 1, 'S is for Sun', 'S comme Sun (soleil)', 19, '0000-00-00 00:00:00'),
(46, 1, 'T is for Tree', 'T comme Tree (arbre)', 20, '0000-00-00 00:00:00'),
(47, 1, 'U is for Umbrella', 'U comme Umbrella (parapluie)', 21, '0000-00-00 00:00:00'),
(48, 1, 'V is for Violin', 'V comme Violin (violon)', 22, '0000-00-00 00:00:00'),
(49, 1, 'W is for Water', 'W comme Water (eau)', 23, '0000-00-00 00:00:00'),
(50, 1, 'X is for Xylophone', 'X comme Xylophone', 24, '0000-00-00 00:00:00'),
(51, 1, 'Y is for Yellow', 'Y comme Yellow (jaune)', 25, '0000-00-00 00:00:00'),
(52, 1, 'Z is for Zebra', 'Z comme Zebra (zebre)', 26, '0000-00-00 00:00:00'),
(53, 2, 'Hello, my name is John', 'Bonjour, je m appelle John', 1, '0000-00-00 00:00:00'),
(54, 2, 'Nice to meet you', 'Ravi de vous rencontrer', 2, '0000-00-00 00:00:00'),
(55, 2, 'How are you today', 'Comment allez-vous aujourd hui', 3, '0000-00-00 00:00:00'),
(56, 2, 'I am fine, thank you', 'Je vais bien, merci', 4, '0000-00-00 00:00:00'),
(57, 2, 'Where are you from', 'D ou venez-vous', 5, '0000-00-00 00:00:00'),
(58, 2, 'I am from France', 'Je viens de France', 6, '0000-00-00 00:00:00'),
(59, 2, 'What is your name', 'Quel est votre nom', 7, '0000-00-00 00:00:00'),
(60, 2, 'How old are you', 'Quel age avez-vous', 8, '0000-00-00 00:00:00'),
(61, 2, 'I am twenty years old', 'J ai vingt ans', 9, '0000-00-00 00:00:00'),
(62, 2, 'Do you speak English', 'Parlez-vous anglais', 10, '0000-00-00 00:00:00'),
(63, 2, 'I speak a little English', 'Je parle un peu anglais', 11, '0000-00-00 00:00:00'),
(64, 2, 'It was nice talking to you', 'C etait un plaisir de vous parler', 12, '0000-00-00 00:00:00'),
(65, 3, 'One, two, three', 'Un, deux, trois', 1, '0000-00-00 00:00:00'),
(66, 3, 'Four, five, six', 'Quatre, cinq, six', 2, '0000-00-00 00:00:00'),
(67, 3, 'Seven, eight, nine', 'Sept, huit, neuf', 3, '0000-00-00 00:00:00'),
(68, 3, 'Ten and eleven', 'Dix et onze', 4, '0000-00-00 00:00:00'),
(69, 3, 'Twelve, thirteen, fourteen', 'Douze, treize, quatorze', 5, '0000-00-00 00:00:00'),
(70, 3, 'Fifteen, sixteen', 'Quinze, seize', 6, '0000-00-00 00:00:00'),
(71, 3, 'Seventeen, eighteen', 'Dix-sept, dix-huit', 7, '0000-00-00 00:00:00'),
(72, 3, 'Nineteen, twenty', 'Dix-neuf, vingt', 8, '0000-00-00 00:00:00'),
(73, 3, 'How much does it cost', 'Combien ca coute', 9, '0000-00-00 00:00:00'),
(74, 3, 'I have two brothers', 'J ai deux freres', 10, '0000-00-00 00:00:00'),
(75, 3, 'She is ten years old', 'Elle a dix ans', 11, '0000-00-00 00:00:00'),
(76, 3, 'There are three apples', 'Il y a trois pommes', 12, '0000-00-00 00:00:00'),
(77, 3, 'Give me five minutes', 'Donne-moi cinq minutes', 13, '0000-00-00 00:00:00'),
(78, 3, 'I wake up at seven', 'Je me reveille a sept heures', 14, '0000-00-00 00:00:00'),
(79, 3, 'One hundred percent', 'Cent pour cent', 15, '0000-00-00 00:00:00'),
(80, 3, 'A thousand thanks', 'Mille mercis', 16, '0000-00-00 00:00:00'),
(81, 3, 'First, second, third', 'Premier, deuxieme, troisieme', 17, '0000-00-00 00:00:00'),
(82, 3, 'The fifth day of the month', 'Le cinquieme jour du mois', 18, '0000-00-00 00:00:00'),
(83, 3, 'Thirty plus fifty is eighty', 'Trente plus cinquante egale quatre-vingts', 19, '0000-00-00 00:00:00'),
(84, 3, 'The number is forty two', 'Le nombre est quarante-deux', 20, '0000-00-00 00:00:00'),
(85, 4, 'The sky is blue', 'Le ciel est bleu', 1, '0000-00-00 00:00:00'),
(86, 4, 'Red is my favorite color', 'Le rouge est ma couleur preferee', 2, '0000-00-00 00:00:00'),
(87, 4, 'Green like the grass', 'Vert comme l herbe', 3, '0000-00-00 00:00:00'),
(88, 4, 'Yellow sunshine', 'Le soleil jaune', 4, '0000-00-00 00:00:00'),
(89, 4, 'Black and white', 'Noir et blanc', 5, '0000-00-00 00:00:00'),
(90, 4, 'Purple flowers', 'Des fleurs violettes', 6, '0000-00-00 00:00:00'),
(91, 4, 'Orange is a fruit and a color', 'Orange est un fruit et une couleur', 7, '0000-00-00 00:00:00'),
(92, 4, 'Pink roses are beautiful', 'Les roses roses sont belles', 8, '0000-00-00 00:00:00'),
(93, 4, 'Brown bear in the forest', 'Ours brun dans la foret', 9, '0000-00-00 00:00:00'),
(94, 4, 'Gray clouds before rain', 'Nuages gris avant la pluie', 10, '0000-00-00 00:00:00'),
(95, 4, 'Silver and gold', 'Argent et or', 11, '0000-00-00 00:00:00'),
(96, 4, 'The white snow falls', 'La neige blanche tombe', 12, '0000-00-00 00:00:00'),
(97, 4, 'A dark blue ocean', 'Un ocean bleu fonce', 13, '0000-00-00 00:00:00'),
(98, 4, 'Light green leaves', 'Feuilles vert clair', 14, '0000-00-00 00:00:00'),
(99, 4, 'What color is your car', 'De quelle couleur est ta voiture', 15, '0000-00-00 00:00:00'),
(100, 5, 'Can I see the menu please', 'Puis-je voir le menu s il vous plait', 1, '0000-00-00 00:00:00'),
(101, 5, 'I would like a coffee', 'Je voudrais un cafe', 2, '0000-00-00 00:00:00'),
(102, 5, 'What do you recommend', 'Que recommandez-vous', 3, '0000-00-00 00:00:00'),
(103, 5, 'I am vegetarian', 'Je suis vegetarien', 4, '0000-00-00 00:00:00'),
(104, 5, 'Does this contain nuts', 'Est-ce que cela contient des noix', 5, '0000-00-00 00:00:00'),
(105, 5, 'I would like to order now', 'Je voudrais commander maintenant', 6, '0000-00-00 00:00:00'),
(106, 5, 'Can I have some water please', 'Puis-je avoir de l eau s il vous plait', 7, '0000-00-00 00:00:00'),
(107, 5, 'This is delicious', 'C est delicieux', 8, '0000-00-00 00:00:00'),
(108, 5, 'Could I have more bread', 'Pourrais-je avoir plus de pain', 9, '0000-00-00 00:00:00'),
(109, 5, 'Is service included', 'Le service est-il compris', 10, '0000-00-00 00:00:00'),
(110, 5, 'The bill please', 'L addition s il vous plait', 11, '0000-00-00 00:00:00'),
(111, 5, 'Can I pay by card', 'Puis-je payer par carte', 12, '0000-00-00 00:00:00'),
(112, 5, 'Keep the change', 'Gardez la monnaie', 13, '0000-00-00 00:00:00'),
(113, 5, 'Do you have a table for two', 'Avez-vous une table pour deux', 14, '0000-00-00 00:00:00'),
(114, 5, 'I have a reservation', 'J ai une reservation', 15, '0000-00-00 00:00:00'),
(115, 6, 'Where is the check-in counter', 'Ou est le comptoir d enregistrement', 1, '0000-00-00 00:00:00'),
(116, 6, 'I have a reservation under the name Smith', 'J ai une reservation au nom de Smith', 2, '0000-00-00 00:00:00'),
(117, 6, 'Can I see your passport please', 'Puis-je voir votre passeport s il vous plait', 3, '0000-00-00 00:00:00'),
(118, 6, 'How many bags are you checking in', 'Combien de bagages enregistrez-vous', 4, '0000-00-00 00:00:00'),
(119, 6, 'My suitcase is overweight', 'Ma valise est en surpoids', 5, '0000-00-00 00:00:00'),
(120, 6, 'What time does the flight depart', 'A quelle heure le vol decolle-t-il', 6, '0000-00-00 00:00:00'),
(121, 6, 'The flight has been delayed', 'Le vol a ete retarde', 7, '0000-00-00 00:00:00'),
(122, 6, 'Which gate do I need to go to', 'A quelle porte dois-je me rendre', 8, '0000-00-00 00:00:00'),
(123, 6, 'Is there a shuttle bus to the terminal', 'Y a-t-il une navette pour le terminal', 9, '0000-00-00 00:00:00'),
(124, 6, 'I would like a window seat please', 'Je voudrais un siege cote hublot s il vous plait', 10, '0000-00-00 00:00:00'),
(125, 6, 'Can I have an aisle seat', 'Puis-je avoir un siege cote couloir', 11, '0000-00-00 00:00:00'),
(126, 6, 'Where can I collect my luggage', 'Ou puis-je recuperer mes bagages', 12, '0000-00-00 00:00:00'),
(127, 6, 'My luggage has not arrived', 'Mes bagages ne sont pas arrives', 13, '0000-00-00 00:00:00'),
(128, 6, 'Is there a lost luggage office', 'Y a-t-il un bureau des bagages perdus', 14, '0000-00-00 00:00:00'),
(129, 6, 'I need to declare goods at customs', 'Je dois declarer des marchandises a la douane', 15, '0000-00-00 00:00:00'),
(130, 7, 'I am just looking, thank you', 'Je ne fais que regarder, merci', 1, '0000-00-00 00:00:00'),
(131, 7, 'Do you have this in a larger size', 'Avez-vous ceci en plus grande taille', 2, '0000-00-00 00:00:00'),
(132, 7, 'Where are the fitting rooms', 'Ou sont les cabines d essayage', 3, '0000-00-00 00:00:00'),
(133, 7, 'This does not fit me properly', 'Cela ne me va pas correctement', 4, '0000-00-00 00:00:00'),
(134, 7, 'It is too expensive for me', 'C est trop cher pour moi', 5, '0000-00-00 00:00:00'),
(135, 7, 'Is there a discount on this item', 'Y a-t-il une reduction sur cet article', 6, '0000-00-00 00:00:00'),
(136, 7, 'Can I try this on', 'Puis-je essayer ceci', 7, '0000-00-00 00:00:00'),
(137, 7, 'Do you have any other colors', 'Avez-vous d autres couleurs', 8, '0000-00-00 00:00:00'),
(138, 7, 'I will take it', 'Je le prends', 9, '0000-00-00 00:00:00'),
(139, 7, 'Can I return this if it does not fit', 'Puis-je le retourner s il ne va pas', 10, '0000-00-00 00:00:00'),
(140, 7, 'Do you accept credit cards', 'Acceptez-vous les cartes de credit', 11, '0000-00-00 00:00:00'),
(141, 7, 'Can I have a receipt please', 'Puis-je avoir un recu s il vous plait', 12, '0000-00-00 00:00:00'),
(142, 7, 'Is this on sale', 'Est-ce en solde', 13, '0000-00-00 00:00:00'),
(143, 7, 'What time do you close today', 'A quelle heure fermez-vous aujourd hui', 14, '0000-00-00 00:00:00'),
(144, 7, 'Thank you for your help', 'Merci pour votre aide', 15, '0000-00-00 00:00:00'),
(145, 8, 'Thank you for giving me this opportunity', 'Merci de me donner cette opportunite', 1, '0000-00-00 00:00:00'),
(146, 8, 'I have extensive experience in this field', 'J ai une vaste experience dans ce domaine', 2, '0000-00-00 00:00:00'),
(147, 8, 'I am a highly motivated individual', 'Je suis une personne tres motivee', 3, '0000-00-00 00:00:00'),
(148, 8, 'I work well under pressure', 'Je travaille bien sous pression', 4, '0000-00-00 00:00:00'),
(149, 8, 'What are the main responsibilities of this role', 'Quelles sont les principales responsabilites de ce poste', 5, '0000-00-00 00:00:00'),
(150, 8, 'I consider myself a team player', 'Je me considere comme un joueur d equipe', 6, '0000-00-00 00:00:00'),
(151, 8, 'My greatest strength is problem solving', 'Ma plus grande force est la resolution de problemes', 7, '0000-00-00 00:00:00'),
(152, 8, 'I am looking for a long-term position', 'Je recherche un poste a long terme', 8, '0000-00-00 00:00:00'),
(153, 8, 'Can you tell me about the company culture', 'Pouvez-vous me parler de la culture d entreprise', 9, '0000-00-00 00:00:00'),
(154, 8, 'I am proficient in several software programs', 'Je maitrise plusieurs logiciels', 10, '0000-00-00 00:00:00'),
(155, 8, 'What are the next steps in the process', 'Quelles sont les prochaines etapes du processus', 11, '0000-00-00 00:00:00'),
(156, 8, 'I am eager to contribute to your team', 'Je suis impatient de contribuer a votre equipe', 12, '0000-00-00 00:00:00'),
(157, 8, 'Could you describe a typical workday', 'Pourriez-vous decrire une journee de travail type', 13, '0000-00-00 00:00:00'),
(158, 8, 'I have strong communication skills', 'J ai de solides competences en communication', 14, '0000-00-00 00:00:00'),
(159, 8, 'When can I expect to hear from you', 'Quand puis-je esperer avoir de vos nouvelles', 15, '0000-00-00 00:00:00'),
(160, 9, 'A de Arbol', 'A comme Arbre', 1, '0000-00-00 00:00:00'),
(161, 9, 'B de Barco', 'B comme Bateau', 2, '0000-00-00 00:00:00'),
(162, 9, 'C de Casa', 'C comme Maison', 3, '0000-00-00 00:00:00'),
(163, 9, 'D de Dedo', 'D comme Doigt', 4, '0000-00-00 00:00:00'),
(164, 9, 'E de Estrella', 'E comme Etoile', 5, '0000-00-00 00:00:00'),
(165, 9, 'F de Flor', 'F comme Fleur', 6, '0000-00-00 00:00:00'),
(166, 9, 'G de Gato', 'G comme Chat', 7, '0000-00-00 00:00:00'),
(167, 9, 'H de Huevo', 'H comme Oeuf', 8, '0000-00-00 00:00:00'),
(168, 9, 'I de Isla', 'I comme Ile', 9, '0000-00-00 00:00:00'),
(169, 9, 'J de Jirafa', 'J comme Girafe', 10, '0000-00-00 00:00:00'),
(170, 9, 'K de Kiwi', 'K comme Kiwi', 11, '0000-00-00 00:00:00'),
(171, 9, 'L de Luna', 'L comme Lune', 12, '0000-00-00 00:00:00'),
(172, 9, 'M de Mano', 'M comme Main', 13, '0000-00-00 00:00:00'),
(173, 9, 'N de Nube', 'N comme Nuage', 14, '0000-00-00 00:00:00'),
(174, 9, 'Ñ de Ñandu', 'Ñ comme Nandou', 15, '0000-00-00 00:00:00'),
(175, 10, 'Hola, me llamo Juan', 'Bonjour, je m appelle Juan', 1, '0000-00-00 00:00:00'),
(176, 10, 'Mucho gusto', 'Enchante', 2, '0000-00-00 00:00:00'),
(177, 10, 'Como estas', 'Comment vas-tu', 3, '0000-00-00 00:00:00'),
(178, 10, 'Estoy bien, gracias', 'Je vais bien, merci', 4, '0000-00-00 00:00:00'),
(179, 10, 'De donde eres', 'D ou viens-tu', 5, '0000-00-00 00:00:00'),
(180, 10, 'Soy de Espana', 'Je viens d Espagne', 6, '0000-00-00 00:00:00'),
(181, 10, 'Cuantos anos tienes', 'Quel age as-tu', 7, '0000-00-00 00:00:00'),
(182, 10, 'Tengo veinticinco anos', 'J ai vingt-cinq ans', 8, '0000-00-00 00:00:00'),
(183, 10, 'Hablas espanol', 'Parles-tu espagnol', 9, '0000-00-00 00:00:00'),
(184, 10, 'Hablo un poco de espanol', 'Je parle un peu espagnol', 10, '0000-00-00 00:00:00'),
(185, 10, 'Como te llamas', 'Comment t appelles-tu', 11, '0000-00-00 00:00:00'),
(186, 10, 'Hasta luego', 'A plus tard', 12, '0000-00-00 00:00:00'),
(187, 11, 'Uno, dos, tres', 'Un, deux, trois', 1, '0000-00-00 00:00:00'),
(188, 11, 'Cuatro, cinco, seis', 'Quatre, cinq, six', 2, '0000-00-00 00:00:00'),
(189, 11, 'Siete, ocho, nueve, diez', 'Sept, huit, neuf, dix', 3, '0000-00-00 00:00:00'),
(190, 11, 'Once, doce, trece', 'Onze, douze, treize', 4, '0000-00-00 00:00:00'),
(191, 11, 'Catorce, quince', 'Quatorze, quinze', 5, '0000-00-00 00:00:00'),
(192, 11, 'Dieciseis, diecisiete', 'Seize, dix-sept', 6, '0000-00-00 00:00:00'),
(193, 11, 'Dieciocho, diecinueve, veinte', 'Dix-huit, dix-neuf, vingt', 7, '0000-00-00 00:00:00'),
(194, 11, 'Treinta y uno', 'Trente et un', 8, '0000-00-00 00:00:00'),
(195, 11, 'Cuarenta y dos', 'Quarante-deux', 9, '0000-00-00 00:00:00'),
(196, 11, 'Cincuenta', 'Cinquante', 10, '0000-00-00 00:00:00'),
(197, 11, 'Sesenta y tres', 'Soixante-trois', 11, '0000-00-00 00:00:00'),
(198, 11, 'Setenta y cuatro', 'Soixante-quatorze', 12, '0000-00-00 00:00:00'),
(199, 11, 'Ochenta', 'Quatre-vingts', 13, '0000-00-00 00:00:00'),
(200, 11, 'Noventa', 'Quatre-vingt-dix', 14, '0000-00-00 00:00:00'),
(201, 11, 'Cien por ciento', 'Cent pour cent', 15, '0000-00-00 00:00:00'),
(202, 12, 'El cielo es azul', 'Le ciel est bleu', 1, '0000-00-00 00:00:00'),
(203, 12, 'Rojo como una manzana', 'Rouge comme une pomme', 2, '0000-00-00 00:00:00'),
(204, 12, 'Verde como la hierba', 'Vert comme l herbe', 3, '0000-00-00 00:00:00'),
(205, 12, 'Amarillo como el sol', 'Jaune comme le soleil', 4, '0000-00-00 00:00:00'),
(206, 12, 'Blanco y negro', 'Blanc et noir', 5, '0000-00-00 00:00:00'),
(207, 12, 'Las flores son moradas', 'Les fleurs sont violettes', 6, '0000-00-00 00:00:00'),
(208, 12, 'Naranja es una fruta', 'Orange est un fruit', 7, '0000-00-00 00:00:00'),
(209, 12, 'Rosa y bonito', 'Rose et joli', 8, '0000-00-00 00:00:00'),
(210, 12, 'Un oso marron', 'Un ours marron', 9, '0000-00-00 00:00:00'),
(211, 12, 'Nubes grises', 'Nuages gris', 10, '0000-00-00 00:00:00'),
(212, 12, 'Oro y plata', 'Or et argent', 11, '0000-00-00 00:00:00'),
(213, 12, 'De que color es', 'De quelle couleur est-ce', 12, '0000-00-00 00:00:00'),
(214, 13, 'La carta por favor', 'La carte s il vous plait', 1, '0000-00-00 00:00:00'),
(215, 13, 'Quiero un cafe', 'Je veux un cafe', 2, '0000-00-00 00:00:00'),
(216, 13, 'Que me recomienda', 'Que me recommandez-vous', 3, '0000-00-00 00:00:00'),
(217, 13, 'Soy vegetariano', 'Je suis vegetarien', 4, '0000-00-00 00:00:00'),
(218, 13, 'Tiene opciones sin gluten', 'Avez-vous des options sans gluten', 5, '0000-00-00 00:00:00'),
(219, 13, 'Me gustaria pedir ahora', 'Je voudrais commander maintenant', 6, '0000-00-00 00:00:00'),
(220, 13, 'Agua por favor', 'De l eau s il vous plait', 7, '0000-00-00 00:00:00'),
(221, 13, 'Esto esta delicioso', 'C est delicieux', 8, '0000-00-00 00:00:00'),
(222, 13, 'La cuenta por favor', 'L addition s il vous plait', 9, '0000-00-00 00:00:00'),
(223, 13, 'Se puede pagar con tarjeta', 'Peut-on payer par carte', 10, '0000-00-00 00:00:00'),
(224, 13, 'Tienen una mesa para dos', 'Avez-vous une table pour deux', 11, '0000-00-00 00:00:00'),
(225, 13, 'Tengo una reservacion', 'J ai une reservation', 12, '0000-00-00 00:00:00'),
(226, 14, 'Donde esta el mostrador de facturacion', 'Ou est le comptoir d enregistrement', 1, '0000-00-00 00:00:00'),
(227, 14, 'Tengo una reserva a nombre de Garcia', 'J ai une reservation au nom de Garcia', 2, '0000-00-00 00:00:00'),
(228, 14, 'Me puede mostrar su pasaporte', 'Pouvez-vous me montrer votre passeport', 3, '0000-00-00 00:00:00'),
(229, 14, 'Cuantas maletas va a facturar', 'Combien de valises allez-vous enregistrer', 4, '0000-00-00 00:00:00'),
(230, 14, 'Mi maleta tiene sobrepeso', 'Ma valise est en surpoids', 5, '0000-00-00 00:00:00'),
(231, 14, 'A que hora sale el vuelo', 'A quelle heure part le vol', 6, '0000-00-00 00:00:00'),
(232, 14, 'El vuelo esta retrasado', 'Le vol est retarde', 7, '0000-00-00 00:00:00'),
(233, 14, 'Cual es la puerta de embarque', 'Quelle est la porte d embarquement', 8, '0000-00-00 00:00:00'),
(234, 14, 'Quiero un asiento de ventanilla', 'Je veux un siege cote hublot', 9, '0000-00-00 00:00:00'),
(235, 14, 'Donde puedo recoger mi equipaje', 'Ou puis-je recuperer mes bagages', 10, '0000-00-00 00:00:00'),
(236, 14, 'Mi equipaje no ha llegado', 'Mes bagages ne sont pas arrives', 11, '0000-00-00 00:00:00'),
(237, 14, 'Buen viaje', 'Bon voyage', 12, '0000-00-00 00:00:00'),
(238, 15, 'Solo estoy mirando, gracias', 'Je ne fais que regarder, merci', 1, '0000-00-00 00:00:00'),
(239, 15, 'Tiene esto en una talla mas grande', 'Avez-vous ceci en plus grande taille', 2, '0000-00-00 00:00:00'),
(240, 15, 'Donde estan los probadores', 'Ou sont les cabines d essayage', 3, '0000-00-00 00:00:00'),
(241, 15, 'Es demasiado caro para mi', 'C est trop cher pour moi', 4, '0000-00-00 00:00:00'),
(242, 15, 'Tiene descuento este articulo', 'Cet article a-t-il une reduction', 5, '0000-00-00 00:00:00'),
(243, 15, 'Me lo llevo', 'Je le prends', 6, '0000-00-00 00:00:00'),
(244, 15, 'Aceptan tarjetas de credito', 'Acceptez-vous les cartes de credit', 7, '0000-00-00 00:00:00'),
(245, 15, 'Me puede dar un recibo', 'Pouvez-vous me donner un recu', 8, '0000-00-00 00:00:00'),
(246, 15, 'A que hora cierran hoy', 'A quelle heure fermez-vous aujourd hui', 9, '0000-00-00 00:00:00'),
(247, 15, 'Gracias por su ayuda', 'Merci pour votre aide', 10, '0000-00-00 00:00:00'),
(248, 16, 'Gracias por recibirme hoy', 'Merci de me recevoir aujourd hui', 1, '0000-00-00 00:00:00'),
(249, 16, 'Tengo experiencia en este sector', 'J ai de l experience dans ce secteur', 2, '0000-00-00 00:00:00'),
(250, 16, 'Soy una persona muy trabajadora', 'Je suis une personne tres travailleuse', 3, '0000-00-00 00:00:00'),
(251, 16, 'Me adapto facilmente a los cambios', 'Je m adapte facilement aux changements', 4, '0000-00-00 00:00:00'),
(252, 16, 'Trabajo bien en equipo', 'Je travaille bien en equipe', 5, '0000-00-00 00:00:00'),
(253, 16, 'Quiero desarrollarme profesionalmente', 'Je veux me developper professionnellement', 6, '0000-00-00 00:00:00'),
(254, 16, 'Cuales son los horarios de trabajo', 'Quels sont les horaires de travail', 7, '0000-00-00 00:00:00'),
(255, 16, 'Cuando puedo empezar', 'Quand puis-je commencer', 8, '0000-00-00 00:00:00'),
(256, 16, 'Cual es el salario ofrecido', 'Quel est le salaire offert', 9, '0000-00-00 00:00:00'),
(257, 16, 'Gracias por su consideracion', 'Merci pour votre consideration', 10, '0000-00-00 00:00:00'),
(258, 31, 'A di Albero', 'A comme Arbre', 1, '0000-00-00 00:00:00'),
(259, 31, 'B di Barca', 'B comme Bateau', 2, '0000-00-00 00:00:00'),
(260, 31, 'C di Casa', 'C comme Maison', 3, '0000-00-00 00:00:00'),
(261, 31, 'D di Dente', 'D comme Dent', 4, '0000-00-00 00:00:00'),
(262, 31, 'E di Elefante', 'E comme Elephant', 5, '0000-00-00 00:00:00'),
(263, 31, 'F di Fiore', 'F comme Fleur', 6, '0000-00-00 00:00:00'),
(264, 31, 'G di Gatto', 'G comme Chat', 7, '0000-00-00 00:00:00'),
(265, 31, 'H di Hotel', 'H comme Hotel', 8, '0000-00-00 00:00:00'),
(266, 31, 'I di Isola', 'I comme Ile', 9, '0000-00-00 00:00:00'),
(267, 31, 'L di Luna', 'L comme Lune', 10, '0000-00-00 00:00:00'),
(268, 31, 'M di Mare', 'M comme Mer', 11, '0000-00-00 00:00:00'),
(269, 31, 'N di Notte', 'N comme Nuit', 12, '0000-00-00 00:00:00'),
(270, 31, 'O di Oro', 'O comme Or', 13, '0000-00-00 00:00:00'),
(271, 31, 'P di Pane', 'P comme Pain', 14, '0000-00-00 00:00:00'),
(272, 31, 'R di Roma', 'R comme Rome', 15, '0000-00-00 00:00:00'),
(273, 32, 'Ciao, mi chiamo Marco', 'Bonjour, je m appelle Marco', 1, '0000-00-00 00:00:00'),
(274, 32, 'Piacere di conoscerti', 'Enchante de te rencontrer', 2, '0000-00-00 00:00:00'),
(275, 32, 'Come stai', 'Comment vas-tu', 3, '0000-00-00 00:00:00'),
(276, 32, 'Sto bene, grazie', 'Je vais bien, merci', 4, '0000-00-00 00:00:00'),
(277, 32, 'Di dove sei', 'D ou viens-tu', 5, '0000-00-00 00:00:00'),
(278, 32, 'Sono italiano', 'Je suis italien', 6, '0000-00-00 00:00:00'),
(279, 32, 'Quanti anni hai', 'Quel age as-tu', 7, '0000-00-00 00:00:00'),
(280, 32, 'Ho ventidue anni', 'J ai vingt-deux ans', 8, '0000-00-00 00:00:00'),
(281, 32, 'Parli inglese', 'Parles-tu anglais', 9, '0000-00-00 00:00:00'),
(282, 32, 'Parlo un po di italiano', 'Je parle un peu italien', 10, '0000-00-00 00:00:00'),
(283, 32, 'Come ti chiami', 'Comment t appelles-tu', 11, '0000-00-00 00:00:00'),
(284, 32, 'Arrivederci', 'Au revoir', 12, '0000-00-00 00:00:00'),
(285, 33, 'Uno, due, tre', 'Un, deux, trois', 1, '0000-00-00 00:00:00'),
(286, 33, 'Quattro, cinque, sei', 'Quatre, cinq, six', 2, '0000-00-00 00:00:00'),
(287, 33, 'Sette, otto, nove', 'Sept, huit, neuf', 3, '0000-00-00 00:00:00'),
(288, 33, 'Dieci, undici, dodici', 'Dix, onze, douze', 4, '0000-00-00 00:00:00'),
(289, 33, 'Tredici, quattordici', 'Treize, quatorze', 5, '0000-00-00 00:00:00'),
(290, 33, 'Quindici, sedici', 'Quinze, seize', 6, '0000-00-00 00:00:00'),
(291, 33, 'Diciassette, diciotto', 'Dix-sept, dix-huit', 7, '0000-00-00 00:00:00'),
(292, 33, 'Diciannove, venti', 'Dix-neuf, vingt', 8, '0000-00-00 00:00:00'),
(293, 33, 'Trenta, quaranta', 'Trente, quarante', 9, '0000-00-00 00:00:00'),
(294, 33, 'Cinquanta, sessanta', 'Cinquante, soixante', 10, '0000-00-00 00:00:00'),
(295, 33, 'Settanta, ottanta', 'Soixante-dix, quatre-vingts', 11, '0000-00-00 00:00:00'),
(296, 33, 'Novanta, cento', 'Quatre-vingt-dix, cent', 12, '0000-00-00 00:00:00'),
(297, 33, 'Quanto costa', 'Combien ca coute', 13, '0000-00-00 00:00:00'),
(298, 33, 'Ho due fratelli', 'J ai deux freres', 14, '0000-00-00 00:00:00'),
(299, 33, 'Sono le dieci', 'Il est dix heures', 15, '0000-00-00 00:00:00'),
(300, 34, 'Il menu per favore', 'Le menu s il vous plait', 1, '0000-00-00 00:00:00'),
(301, 34, 'Vorrei un caffe', 'Je voudrais un cafe', 2, '0000-00-00 00:00:00'),
(302, 34, 'Cosa mi consiglia', 'Que me conseillez-vous', 3, '0000-00-00 00:00:00'),
(303, 34, 'Sono vegetariano', 'Je suis vegetarien', 4, '0000-00-00 00:00:00'),
(304, 34, 'Avete opzioni senza glutine', 'Avez-vous des options sans gluten', 5, '0000-00-00 00:00:00'),
(305, 34, 'Vorrei ordinare adesso', 'Je voudrais commander maintenant', 6, '0000-00-00 00:00:00'),
(306, 34, 'Acqua naturale per favore', 'De l eau plate s il vous plait', 7, '0000-00-00 00:00:00'),
(307, 34, 'Acqua frizzante per favore', 'De l eau gazeuse s il vous plait', 8, '0000-00-00 00:00:00'),
(308, 34, 'E delizioso', 'C est delicieux', 9, '0000-00-00 00:00:00'),
(309, 34, 'Ancora un po di pane per favore', 'Encore un peu de pain s il vous plait', 10, '0000-00-00 00:00:00'),
(310, 34, 'Il servizio e incluso', 'Le service est inclus', 11, '0000-00-00 00:00:00'),
(311, 34, 'Il conto per favore', 'L addition s il vous plait', 12, '0000-00-00 00:00:00'),
(312, 34, 'Posso pagare con la carta', 'Puis-je payer par carte', 13, '0000-00-00 00:00:00'),
(313, 34, 'Avete un tavolo per due', 'Avez-vous une table pour deux', 14, '0000-00-00 00:00:00'),
(314, 34, 'Buon appetito', 'Bon appetit', 15, '0000-00-00 00:00:00'),
(315, 35, 'Dove il check-in', 'Ou est l enregistrement', 1, '0000-00-00 00:00:00'),
(316, 35, 'Ho una prenotazione a nome Rossi', 'J ai une reservation au nom de Rossi', 2, '0000-00-00 00:00:00'),
(317, 35, 'Posso vedere il suo passaporto', 'Puis-je voir votre passeport', 3, '0000-00-00 00:00:00'),
(318, 35, 'Quante valigie consegna', 'Combien de valises enregistrez-vous', 4, '0000-00-00 00:00:00'),
(319, 35, 'La mia valigia e in sovrappeso', 'Ma valise est en surpoids', 5, '0000-00-00 00:00:00'),
(320, 35, 'A che ora parte il volo', 'A quelle heure part le vol', 6, '0000-00-00 00:00:00'),
(321, 35, 'Il volo e in ritardo', 'Le vol est en retard', 7, '0000-00-00 00:00:00'),
(322, 35, 'Qual e il gate di imbarco', 'Quelle est la porte d embarquement', 8, '0000-00-00 00:00:00'),
(323, 35, 'C e una navetta per il terminal', 'Y a-t-il une navette pour le terminal', 9, '0000-00-00 00:00:00'),
(324, 35, 'Vorrei un posto al finestrino', 'Je voudrais un siege cote hublot', 10, '0000-00-00 00:00:00'),
(325, 35, 'Posso avere un posto in corridoio', 'Puis-je avoir un siege cote couloir', 11, '0000-00-00 00:00:00'),
(326, 35, 'Dove posso ritirare il bagaglio', 'Ou puis-je recuperer mes bagages', 12, '0000-00-00 00:00:00'),
(327, 35, 'Il mio bagaglio non e arrivato', 'Mes bagages ne sont pas arrives', 13, '0000-00-00 00:00:00'),
(328, 35, 'Devo dichiarare alla dogana', 'Je dois declarer a la douane', 14, '0000-00-00 00:00:00'),
(329, 35, 'Buon viaggio', 'Bon voyage', 15, '0000-00-00 00:00:00'),
(330, 36, 'Sto solo guardando, grazie', 'Je ne fais que regarder, merci', 1, '0000-00-00 00:00:00'),
(331, 36, 'Avete questo in una taglia piu grande', 'Avez-vous ceci en plus grande taille', 2, '0000-00-00 00:00:00'),
(332, 36, 'Dove sono i camerini', 'Ou sont les cabines d essayage', 3, '0000-00-00 00:00:00'),
(333, 36, 'Questo non mi va bene', 'Cela ne me va pas', 4, '0000-00-00 00:00:00'),
(334, 36, 'E troppo caro per me', 'C est trop cher pour moi', 5, '0000-00-00 00:00:00'),
(335, 36, 'C e uno sconto su questo articolo', 'Y a-t-il une reduction sur cet article', 6, '0000-00-00 00:00:00'),
(336, 36, 'Posso provarlo', 'Puis-je l essayer', 7, '0000-00-00 00:00:00'),
(337, 36, 'Avete altri colori', 'Avez-vous d autres couleurs', 8, '0000-00-00 00:00:00'),
(338, 36, 'Lo prendo', 'Je le prends', 9, '0000-00-00 00:00:00'),
(339, 36, 'Posso restituirlo se non va bene', 'Puis-je le retourner s il ne va pas', 10, '0000-00-00 00:00:00'),
(340, 36, 'Accettate carte di credito', 'Acceptez-vous les cartes de credit', 11, '0000-00-00 00:00:00'),
(341, 36, 'Posso avere una ricevuta', 'Puis-je avoir un recu', 12, '0000-00-00 00:00:00'),
(342, 36, 'E in saldo', 'Est-ce en solde', 13, '0000-00-00 00:00:00'),
(343, 36, 'A che ora chiudete oggi', 'A quelle heure fermez-vous aujourd hui', 14, '0000-00-00 00:00:00'),
(344, 36, 'Grazie per il vostro aiuto', 'Merci pour votre aide', 15, '0000-00-00 00:00:00'),
(345, 17, 'A - あ', 'A en hiragana', 1, '0000-00-00 00:00:00'),
(346, 17, 'I - い', 'I en hiragana', 2, '0000-00-00 00:00:00'),
(347, 17, 'U - う', 'U en hiragana', 3, '0000-00-00 00:00:00'),
(348, 17, 'E - え', 'E en hiragana', 4, '0000-00-00 00:00:00'),
(349, 17, 'O - お', 'O en hiragana', 5, '0000-00-00 00:00:00'),
(350, 17, 'Ka - か', 'Ka en hiragana', 6, '0000-00-00 00:00:00'),
(351, 17, 'Ki - き', 'Ki en hiragana', 7, '0000-00-00 00:00:00'),
(352, 17, 'Ku - く', 'Ku en hiragana', 8, '0000-00-00 00:00:00'),
(353, 17, 'Ke - け', 'Ke en hiragana', 9, '0000-00-00 00:00:00'),
(354, 17, 'Ko - こ', 'Ko en hiragana', 10, '0000-00-00 00:00:00'),
(355, 17, 'Sa - さ', 'Sa en hiragana', 11, '0000-00-00 00:00:00'),
(356, 17, 'Shi - し', 'Shi en hiragana', 12, '0000-00-00 00:00:00'),
(357, 17, 'Su - す', 'Su en hiragana', 13, '0000-00-00 00:00:00'),
(358, 17, 'Se - せ', 'Se en hiragana', 14, '0000-00-00 00:00:00'),
(359, 17, 'So - そ', 'So en hiragana', 15, '0000-00-00 00:00:00'),
(360, 17, 'Ta - た', 'Ta en hiragana', 16, '0000-00-00 00:00:00'),
(361, 17, 'Chi - ち', 'Chi en hiragana', 17, '0000-00-00 00:00:00'),
(362, 17, 'Tsu - つ', 'Tsu en hiragana', 18, '0000-00-00 00:00:00'),
(363, 17, 'Te - て', 'Te en hiragana', 19, '0000-00-00 00:00:00'),
(364, 17, 'To - と', 'To en hiragana', 20, '0000-00-00 00:00:00'),
(365, 18, 'A - ア', 'A en katakana', 1, '0000-00-00 00:00:00'),
(366, 18, 'I - イ', 'I en katakana', 2, '0000-00-00 00:00:00'),
(367, 18, 'U - ウ', 'U en katakana', 3, '0000-00-00 00:00:00'),
(368, 18, 'E - エ', 'E en katakana', 4, '0000-00-00 00:00:00'),
(369, 18, 'O - オ', 'O en katakana', 5, '0000-00-00 00:00:00'),
(370, 18, 'Ka - カ', 'Ka en katakana', 6, '0000-00-00 00:00:00'),
(371, 18, 'Ki - キ', 'Ki en katakana', 7, '0000-00-00 00:00:00'),
(372, 18, 'Ku - ク', 'Ku en katakana', 8, '0000-00-00 00:00:00'),
(373, 18, 'Ke - ケ', 'Ke en katakana', 9, '0000-00-00 00:00:00'),
(374, 18, 'Ko - コ', 'Ko en katakana', 10, '0000-00-00 00:00:00'),
(375, 18, 'Sa - サ', 'Sa en katakana', 11, '0000-00-00 00:00:00'),
(376, 18, 'Shi - シ', 'Shi en katakana', 12, '0000-00-00 00:00:00'),
(377, 18, 'Su - ス', 'Su en katakana', 13, '0000-00-00 00:00:00'),
(378, 18, 'Se - セ', 'Se en katakana', 14, '0000-00-00 00:00:00'),
(379, 18, 'So - ソ', 'So en katakana', 15, '0000-00-00 00:00:00'),
(380, 18, 'Ta - タ', 'Ta en katakana', 16, '0000-00-00 00:00:00'),
(381, 18, 'Chi - チ', 'Chi en katakana', 17, '0000-00-00 00:00:00'),
(382, 18, 'Tsu - ツ', 'Tsu en katakana', 18, '0000-00-00 00:00:00'),
(383, 18, 'Te - テ', 'Te en katakana', 19, '0000-00-00 00:00:00'),
(384, 18, 'To - ト', 'To en katakana', 20, '0000-00-00 00:00:00'),
(385, 19, 'Ohayou gozaimasu', 'Bonjour (le matin)', 1, '0000-00-00 00:00:00'),
(386, 19, 'Konnichiwa', 'Bonjour (apres-midi)', 2, '0000-00-00 00:00:00'),
(387, 19, 'Konbanwa', 'Bonsoir', 3, '0000-00-00 00:00:00'),
(388, 19, 'Hajimemashite', 'Enchante (formule de presentation)', 4, '0000-00-00 00:00:00'),
(389, 19, 'Watashi no namae wa Yuki desu', 'Je m appelle Yuki', 5, '0000-00-00 00:00:00'),
(390, 19, 'Yoroshiku onegaishimasu', 'Merci de faire bonne connaissance', 6, '0000-00-00 00:00:00'),
(391, 19, 'Ogenki desu ka', 'Comment allez-vous', 7, '0000-00-00 00:00:00'),
(392, 19, 'Genki desu', 'Je vais bien', 8, '0000-00-00 00:00:00'),
(393, 19, 'Dochira kara desu ka', 'D ou venez-vous', 9, '0000-00-00 00:00:00'),
(394, 19, 'Nihon kara kimashita', 'Je viens du Japon', 10, '0000-00-00 00:00:00'),
(395, 19, 'Nan sai desu ka', 'Quel age avez-vous', 11, '0000-00-00 00:00:00'),
(396, 19, 'Ni juu sai desu', 'J ai vingt ans', 12, '0000-00-00 00:00:00'),
(397, 19, 'Eigo wo hanashimasu ka', 'Parlez-vous anglais', 13, '0000-00-00 00:00:00'),
(398, 19, 'Sukoshi nihongo wo hanashimasu', 'Je parle un peu japonais', 14, '0000-00-00 00:00:00'),
(399, 19, 'Sayounara', 'Au revoir', 15, '0000-00-00 00:00:00'),
(400, 20, 'Ichi, ni, san', 'Un, deux, trois', 1, '0000-00-00 00:00:00'),
(401, 20, 'Shi, go, roku', 'Quatre, cinq, six', 2, '0000-00-00 00:00:00'),
(402, 20, 'Shichi, hachi, kyuu', 'Sept, huit, neuf', 3, '0000-00-00 00:00:00'),
(403, 20, 'Juu, juuichi', 'Dix, onze', 4, '0000-00-00 00:00:00'),
(404, 20, 'Ni juu, san juu', 'Vingt, trente', 5, '0000-00-00 00:00:00'),
(405, 20, 'Yon juu, go juu', 'Quarante, cinquante', 6, '0000-00-00 00:00:00'),
(406, 20, 'Roku juu, nana juu', 'Soixante, soixante-dix', 7, '0000-00-00 00:00:00'),
(407, 20, 'Hachi juu, kyuu juu', 'Quatre-vingts, quatre-vingt-dix', 8, '0000-00-00 00:00:00'),
(408, 20, 'Hyaku', 'Cent', 9, '0000-00-00 00:00:00'),
(409, 20, 'Sen', 'Mille', 10, '0000-00-00 00:00:00'),
(410, 20, 'Hitotsu, futatsu', 'Un objet, deux objets', 11, '0000-00-00 00:00:00'),
(411, 20, 'Mittsu, yottsu', 'Trois objets, quatre objets', 12, '0000-00-00 00:00:00'),
(412, 20, 'Itsutsu, muttsu', 'Cinq objets, six objets', 13, '0000-00-00 00:00:00'),
(413, 20, 'Ikura desu ka', 'Combien ca coute', 14, '0000-00-00 00:00:00'),
(414, 20, 'Nan nin desu ka', 'Combien de personnes', 15, '0000-00-00 00:00:00'),
(415, 20, 'Ni mai kudasai', 'Deux billets s il vous plait', 16, '0000-00-00 00:00:00'),
(416, 20, 'San pun, go fun', 'Trois minutes, cinq minutes', 17, '0000-00-00 00:00:00'),
(417, 20, 'Nan ji desu ka', 'Quelle heure est-il', 18, '0000-00-00 00:00:00'),
(418, 20, 'Ichi jihan desu', 'Il est une heure et demie', 19, '0000-00-00 00:00:00'),
(419, 20, 'San ji juu go fun desu', 'Il est trois heures trente-cinq', 20, '0000-00-00 00:00:00'),
(420, 21, 'Menyuu wo misete kudasai', 'Montrez-moi le menu s il vous plait', 1, '0000-00-00 00:00:00'),
(421, 21, 'Koohii wo kudasai', 'Un cafe s il vous plait', 2, '0000-00-00 00:00:00'),
(422, 21, 'Ocha wo kudasai', 'Un the s il vous plait', 3, '0000-00-00 00:00:00'),
(423, 21, 'Osusume wa nan desu ka', 'Que recommandez-vous', 4, '0000-00-00 00:00:00'),
(424, 21, 'Mizu wo kudasai', 'De l eau s il vous plait', 5, '0000-00-00 00:00:00'),
(425, 21, 'Oishii desu', 'C est delicieux', 6, '0000-00-00 00:00:00'),
(426, 21, 'Okanjou wo onegaishimasu', 'L addition s il vous plait', 7, '0000-00-00 00:00:00'),
(427, 21, 'Kaado de haraimasu', 'Je paie par carte', 8, '0000-00-00 00:00:00'),
(428, 21, 'Genkin de haraimasu', 'Je paie en especes', 9, '0000-00-00 00:00:00'),
(429, 21, 'Futari desu', 'Nous sommes deux', 10, '0000-00-00 00:00:00'),
(430, 21, 'Yoyaku shiteimasu', 'J ai une reservation', 11, '0000-00-00 00:00:00'),
(431, 21, 'Itadakimasu', 'Bon appetit (avant le repas)', 12, '0000-00-00 00:00:00'),
(432, 21, 'Gochisousama deshita', 'Merci pour ce delicieux repas', 13, '0000-00-00 00:00:00'),
(433, 21, 'Sumimasen', 'Excusez-moi', 14, '0000-00-00 00:00:00'),
(434, 21, 'Mou sukoshi kudasai', 'Encore un peu s il vous plait', 15, '0000-00-00 00:00:00'),
(435, 22, 'Eki wa doko desu ka', 'Ou est la gare', 1, '0000-00-00 00:00:00'),
(436, 22, 'Kippu wo kaitai desu', 'Je voudrais acheter un billet', 2, '0000-00-00 00:00:00'),
(437, 22, 'Shinkansen no noriba wa doko desu ka', 'Ou est le quai du Shinkansen', 3, '0000-00-00 00:00:00'),
(438, 22, 'Tsugi no densha wa nanji desu ka', 'A quelle heure est le prochain train', 4, '0000-00-00 00:00:00'),
(439, 22, 'Tokyo made dono kurai kakarimasu ka', 'Combien de temps pour aller a Tokyo', 5, '0000-00-00 00:00:00'),
(440, 22, 'Kono seki wa aiteimasu ka', 'Ce siege est-il libre', 6, '0000-00-00 00:00:00'),
(441, 22, 'Norikae ga hitsuyou desu ka', 'Faut-il changer de train', 7, '0000-00-00 00:00:00'),
(442, 22, 'Jikokuhyou wa doko desu ka', 'Ou est l horaire des trains', 8, '0000-00-00 00:00:00'),
(443, 22, 'Michimichi ni mayotte shimaimashita', 'Je me suis perdu en chemin', 9, '0000-00-00 00:00:00'),
(444, 22, 'Chizu wo kaite moraemasu ka', 'Pouvez-vous me dessiner une carte', 10, '0000-00-00 00:00:00'),
(445, 22, 'Kippu wo nakushimashita', 'J ai perdu mon billet', 11, '0000-00-00 00:00:00'),
(446, 22, 'Tasukete kudasai', 'Aidez-moi s il vous plait', 12, '0000-00-00 00:00:00'),
(447, 22, 'Toire wa doko desu ka', 'Ou sont les toilettes', 13, '0000-00-00 00:00:00'),
(448, 22, 'Basu noriba wa doko desu ka', 'Ou est l arret de bus', 14, '0000-00-00 00:00:00'),
(449, 22, 'Takushii noriba wa doko desu ka', 'Ou est la station de taxi', 15, '0000-00-00 00:00:00'),
(450, 23, 'Kore wa ikura desu ka', 'Combien ca coute', 1, '0000-00-00 00:00:00'),
(451, 23, 'Motto yasui no wa arimasu ka', 'Avez-vous moins cher', 2, '0000-00-00 00:00:00'),
(452, 23, 'Kore wo kudasai', 'Je prends ceci', 3, '0000-00-00 00:00:00'),
(453, 23, 'Mou sukoshi ookii no wa arimasu ka', 'Avez-vous plus grand', 4, '0000-00-00 00:00:00'),
(454, 23, 'Iro ga chigau no wa arimasu ka', 'Avez-vous une autre couleur', 5, '0000-00-00 00:00:00'),
(455, 23, 'Shichaku shite mo ii desu ka', 'Puis-je essayer', 6, '0000-00-00 00:00:00'),
(456, 23, 'Reshiito wo kudasai', 'Un recu s il vous plait', 7, '0000-00-00 00:00:00'),
(457, 23, 'Kaado wa tsukaemasu ka', 'Acceptez-vous la carte', 8, '0000-00-00 00:00:00'),
(458, 23, 'Nanji ni shimarimasu ka', 'A quelle heure fermez-vous', 9, '0000-00-00 00:00:00'),
(459, 23, 'Arigatou gozaimasu', 'Merci beaucoup', 10, '0000-00-00 00:00:00'),
(460, 23, 'Mite mo ii desu ka', 'Puis-je regarder', 11, '0000-00-00 00:00:00'),
(461, 23, 'Kore wa nihonsei desu ka', 'Est-ce fabrique au Japon', 12, '0000-00-00 00:00:00'),
(462, 23, 'Mou sukoshi chiisai no wa arimasu ka', 'Avez-vous plus petit', 13, '0000-00-00 00:00:00'),
(463, 23, 'Takasugiru node kekkou desu', 'C est trop cher, je passe', 14, '0000-00-00 00:00:00'),
(464, 23, 'Mata kimasu', 'Je reviendrai', 15, '0000-00-00 00:00:00'),
(465, 24, 'Osewa ni natte orimasu', 'Merci de prendre soin de moi', 1, '0000-00-00 00:00:00'),
(466, 24, 'Keiken ga arimasu', 'J ai de l experience', 2, '0000-00-00 00:00:00'),
(467, 24, 'Kinmu jikan wa nanji kara desu ka', 'Quels sont les horaires de travail', 3, '0000-00-00 00:00:00'),
(468, 24, 'Kyuryou wa ikura desu ka', 'Quel est le salaire', 4, '0000-00-00 00:00:00'),
(469, 24, 'Itsu kara hairemasu ka', 'Quand puis-je commencer', 5, '0000-00-00 00:00:00'),
(470, 24, 'Yoroshiku onegai shimasu', 'Je compte sur votre soutien', 6, '0000-00-00 00:00:00'),
(471, 24, 'Shitsurei shimasu', 'Excusez-moi (en partant)', 7, '0000-00-00 00:00:00'),
(472, 24, 'Ganbarimasu', 'Je ferai de mon mieux', 8, '0000-00-00 00:00:00'),
(473, 24, 'Otsukaresama desu', 'Bon travail (felicitations)', 9, '0000-00-00 00:00:00'),
(474, 24, 'Arigatou gozaimashita', 'Merci beaucoup (passe)', 10, '0000-00-00 00:00:00'),
(475, 24, 'Kaigi wa nanji kara desu ka', 'A quelle heure est la reunion', 11, '0000-00-00 00:00:00'),
(476, 24, 'Houkoku sho wo teishutsu shimasu', 'Je vais soumettre le rapport', 12, '0000-00-00 00:00:00'),
(477, 24, 'Yasumi wo toritai desu', 'Je voudrais prendre un conge', 13, '0000-00-00 00:00:00'),
(478, 24, 'Shigoto wa tanoshii desu', 'Le travail est agreable', 14, '0000-00-00 00:00:00'),
(479, 24, 'Mata ashita', 'A demain', 15, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `progress`
--

CREATE TABLE `progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `phrase_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `score` float NOT NULL,
  `transcription` varchar(500) DEFAULT NULL,
  `attempted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `progress`
--

INSERT INTO `progress` (`id`, `user_id`, `phrase_id`, `lesson_id`, `score`, `transcription`, `attempted_at`) VALUES
(1, 2, 1, 1, 75, ' I is for Apple', '2026-07-19 06:38:59'),
(2, 2, 53, 2, 100, ' Hello, my name is John.', '2026-07-19 06:39:29'),
(3, 2, 54, 2, 100, ' Nice to meet you.', '2026-07-19 06:39:45'),
(4, 2, 55, 2, 75, ' How are you Monday?', '2026-07-19 06:40:06'),
(5, 2, 56, 2, 100, ' I am fine, thank you.', '2026-07-19 06:40:28'),
(6, 2, 57, 2, 100, ' Where are you from?', '2026-07-19 06:40:42'),
(7, 2, 58, 2, 75, ' I am from Madagascar.', '2026-07-19 06:40:58'),
(8, 2, 65, 3, 100, ' One, two, three. One, two, three.', '2026-07-19 07:37:45'),
(9, 2, 66, 3, 100, ' four five six', '2026-07-19 07:38:27'),
(10, 2, 145, 8, 43, ' Thank you for me this', '2026-07-19 07:40:54'),
(11, 2, 145, 8, 43, ' Thank you for this opportunity.', '2026-07-19 07:41:39'),
(12, 2, 146, 8, 29, ' I have experience in this field.', '2026-07-19 07:42:03'),
(13, 3, 258, 31, 0, ' Adi Albero', '2026-07-19 07:43:20'),
(14, 3, 330, 36, 100, ' sto solo guardando grazie', '2026-07-19 07:44:05'),
(15, 3, 331, 36, 14, ' Avete costo più grande.', '2026-07-19 07:44:25'),
(16, 6, 345, 17, 0, 'ああ', '2026-07-19 07:47:18'),
(17, 6, 385, 19, 0, 'おはようございます', '2026-07-19 07:47:42'),
(18, 6, 385, 19, 0, 'おはようございます', '2026-07-19 07:52:50'),
(19, 6, 385, 19, 0, 'おはようございます', '2026-07-19 08:08:01'),
(20, 6, 385, 19, 0, 'おはようございます', '2026-07-19 08:08:24'),
(21, 6, 385, 19, 0, 'おはよう', '2026-07-19 08:08:30'),
(22, 6, 386, 19, 0, 'こんにちは', '2026-07-19 08:08:41'),
(23, 6, 386, 19, 0, 'こんにちは', '2026-07-19 08:09:00'),
(24, 6, 387, 19, 0, 'こんばんは', '2026-07-19 08:09:28'),
(25, 6, 387, 19, 0, 'こんばんは', '2026-07-19 08:09:51'),
(26, 2, 53, 2, 100, ' Hello, my name is John.', '2026-07-19 08:10:27'),
(27, 2, 54, 2, 100, ' Nice to meet you!', '2026-07-19 08:10:46'),
(28, 2, 55, 2, 75, ' How are you?', '2026-07-19 08:11:03'),
(29, 2, 56, 2, 0, ' Thank you.', '2026-07-19 08:12:15'),
(30, 2, 57, 2, 75, ' Where are you?', '2026-07-19 08:12:49'),
(31, 2, 53, 2, 100, ' Hello, my name is John.', '2026-07-19 08:24:46'),
(32, 2, 53, 2, 80, ' Hello, my name is Rastafari.', '2026-07-19 08:24:49'),
(33, 2, 53, 2, 80, ' Hello, my name is Sarbite Koson. Ato Nohu Gansal.', '2026-07-19 08:25:30'),
(34, 2, 53, 2, 80, ' hello my name is Bri', '2026-07-19 08:25:31'),
(35, 2, 53, 2, 20, ' What\'s your name? Tere Mandel Zio? Nooooooo', '2026-07-19 08:25:37'),
(36, 2, 53, 2, 80, ' Hello, my name is Sharpeethi.', '2026-07-19 08:29:37'),
(37, 2, 53, 2, 100, ' Hello, my name is John.', '2026-07-19 08:30:15'),
(38, 2, 53, 2, 0, ' My name is John.', '2026-07-19 08:46:27'),
(39, 2, 53, 2, 100, ' Hello, my name is John.', '2026-07-19 08:46:43'),
(40, 2, 53, 2, 80, ' Hello, my name is', '2026-07-19 08:53:22'),
(41, 2, 54, 2, 25, ' Nice meet you.', '2026-07-19 08:53:53'),
(42, 2, 54, 2, 0, ' To meet you!', '2026-07-19 08:54:13'),
(43, 2, 54, 2, 0, ' To meet you!', '2026-07-19 08:54:26'),
(44, 2, 55, 2, 0, ' today', '2026-07-19 08:54:49'),
(45, 2, 53, 2, 100, ' Hello, my name is John.', '2026-07-19 11:36:19'),
(46, 2, 53, 2, 100, ' Hello, my name is John.', '2026-07-19 11:36:36'),
(47, 2, 53, 2, 100, ' Hello, my name is John.', '2026-07-19 11:49:18'),
(48, 2, 54, 2, 100, ' Nice to meet you!', '2026-07-19 11:49:42'),
(49, 2, 55, 2, 75, ' How are you?', '2026-07-19 11:50:15'),
(50, 2, 56, 2, 100, ' I am fine, thank you.', '2026-07-19 11:53:32'),
(51, 2, 57, 2, 75, ' Where are you?', '2026-07-19 11:54:47'),
(52, 2, 58, 2, 0, ' From France.', '2026-07-19 11:55:44'),
(53, 2, 59, 2, 100, ' What is your name?', '2026-07-19 11:56:11'),
(54, 2, 1, 1, 0, ' Hi, I\'m Sir ComoApples', '2026-07-19 12:31:29'),
(55, 2, 145, 8, 100, ' Thank you for giving me this opportunity.', '2026-07-19 12:31:55'),
(56, 2, 146, 8, 100, ' I have extensive experience in this field.', '2026-07-19 12:32:13'),
(57, 2, 55, 2, 75, ' How are you?', '2026-07-19 12:32:27'),
(58, 2, 57, 2, 75, ' Where are you?', '2026-07-19 12:32:38'),
(59, 2, 58, 2, 75, ' I am from', '2026-07-19 12:32:51'),
(60, 2, 1, 1, 0, ' Ah, this is for Apple.', '2026-07-19 13:13:34'),
(61, 2, 55, 2, 75, ' How are you?', '2026-07-19 13:13:57'),
(62, 2, 57, 2, 100, ' Where are you from?', '2026-07-19 13:14:22'),
(63, 1, 175, 10, 25, ' Hola, mi nombre es Juan.', '2026-07-19 13:15:32'),
(64, 1, 176, 10, 100, ' mucho gusto', '2026-07-19 13:16:12'),
(65, 1, 177, 10, 100, ' ¿Cómo estás?', '2026-07-19 13:16:31'),
(66, 1, 178, 10, 100, ' Estoy bien, gracias.', '2026-07-19 13:16:53'),
(67, 1, 179, 10, 100, ' ¿De dónde eres?', '2026-07-19 13:17:09'),
(68, 1, 180, 10, 67, ' Soy de...', '2026-07-19 13:17:38'),
(69, 1, 180, 10, 100, ' Soy de España.', '2026-07-19 13:17:55'),
(70, 1, 181, 10, 100, ' ¿Cuántos años tienes?', '2026-07-19 13:18:12'),
(71, 1, 182, 10, 67, ' Tengo 25 años.', '2026-07-19 13:18:34'),
(72, 8, 1, 1, 0, ' Eyes for Abel!', '2026-07-19 15:05:06'),
(73, 8, 53, 2, 100, ' Hello, my name is John.', '2026-07-19 15:05:53'),
(74, 8, 100, 5, 100, ' Can I see the menu please?', '2026-07-19 15:10:10'),
(75, 8, 101, 5, 20, ' I like coffee.', '2026-07-19 15:10:29'),
(76, 9, 385, 19, 0, 'おー、ござんまそまいそ', '2026-07-19 15:20:01');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `target_language` varchar(255) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `current_streak` int(11) DEFAULT 0,
  `last_practice_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `xp` int(11) DEFAULT 0,
  `level` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `target_language`, `profile_image_url`, `current_streak`, `last_practice_date`, `created_at`, `updated_at`, `xp`, `level`) VALUES
(1, 'sarobidy.vetsotiana@gmail.com', '$2b$10$Lr57VNKf5aOGjpbiDuwNW.b194MgLins5o0.uSIogTWgVXB2A1qfC', 'espagnol', NULL, 1, '2026-07-19 13:18:34', '2026-07-18 23:18:16', '2026-07-19 13:18:34', 66, 1),
(2, 'lesarhobids@gmail.com', '$2b$10$E8l/OVvxBzdT3CmYZD68T.c5jLVqeoH1hRLcFYsE8SuT92pj8AXIi', 'anglais', 'https://api.dicebear.com/7.x/avataaars/png?seed=Zoe', 1, '2026-07-19 13:14:22', '2026-07-18 23:21:06', '2026-07-19 13:14:22', 108, 2),
(3, 'xuyate03@gmail.com', '$2b$10$/e.zKl1oEr10M716USIxE.48cKTrVVn9BGxrTRHPGevh08jKxBqx2', 'italien', NULL, 1, '2026-07-19 07:44:25', '2026-07-18 23:22:33', '2026-07-19 07:44:25', 0, 1),
(4, 'xuyate01@gmail.com', '$2b$10$.xQtWImRt7imSoaXW.ZymO6xvUmdrvMPAa4/bSctbDkusZp0aNk9y', 'italien', NULL, 0, NULL, '2026-07-18 23:26:42', '2026-07-18 23:26:46', 0, 1),
(5, 'xuyate02@gmail.com', '$2b$10$DFy1iFsztxBobb0MvzROh.wHb9BvmXjRj3gsJKAigLAIRqIeUZ4UK', 'japonais', NULL, 0, NULL, '2026-07-18 23:32:11', '2026-07-18 23:32:15', 0, 1),
(6, 'xuyate04@gmail.com', '$2b$10$ufuPVKovAGtRz8UpJWFLhuY3T/U9.mfI3YW2y7npjpjSfmGbeRi2C', 'japonais', NULL, 1, '2026-07-19 08:09:51', '2026-07-19 07:46:44', '2026-07-19 08:09:51', 0, 1),
(7, 'toxxrt01@gmail.com', '$2b$10$bZU/UXdQa8rGZw2UcFkEiuzDHhmPN4rt5kgbRaXT31ic8PgbFClme', 'japonais', NULL, 0, NULL, '2026-07-19 13:19:36', '2026-07-19 13:19:41', 0, 1),
(8, 'antenainaprosper123@gmail.com', '$2b$10$NwOus0C9lvYyNf87RWMhLuhaz38WP.t6mWKduieArXYDPQBW.KdIm', 'anglais', NULL, 1, '2026-07-19 15:10:29', '2026-07-19 15:03:24', '2026-07-19 15:10:29', 24, 1),
(9, 'antenainaprosper124@gmail.com', '$2b$10$qLVOIVTLyO5/jxpSvERjtudeg7yTYs9/moduIV7Qj3wjFuMdrnxHa', 'japonais', NULL, 1, '2026-07-19 15:20:01', '2026-07-19 15:16:20', '2026-07-19 15:20:01', 2, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `phrases`
--
ALTER TABLE `phrases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Index pour la table `progress`
--
ALTER TABLE `progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `phrase_id` (`phrase_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `phrases`
--
ALTER TABLE `phrases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=480;

--
-- AUTO_INCREMENT pour la table `progress`
--
ALTER TABLE `progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `phrases`
--
ALTER TABLE `phrases`
  ADD CONSTRAINT `phrases_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `progress`
--
ALTER TABLE `progress`
  ADD CONSTRAINT `progress_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `progress_ibfk_20` FOREIGN KEY (`phrase_id`) REFERENCES `phrases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `progress_ibfk_21` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
