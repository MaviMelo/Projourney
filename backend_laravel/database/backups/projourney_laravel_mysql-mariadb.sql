/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.6-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: projourney_laravel
-- ------------------------------------------------------
-- Server version	11.8.6-MariaDB-0+deb13u1 from Debian

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;


-- ___COMANDOS ÚTEIS E CONFIGURAÇÕES:____________________________________________________
--
-- mysql -u <usuário> -p projourney_laravel < projourney_laravel_mysql-mariadb.sql
--
-- mysqldump -u <usuário> -p projourney_laravel > projourney_laravel_mysql-mariadb.sql
--
-- CREATE USER '<userName>'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>';
--
-- ALTER USER '<userName>'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>'; 
--
-- DROP DATABASE IF EXISTS projourney_laravel;
-- 
-- CREATE DATABASE projourney_laravel;
-- USE projourney_laravel;
--

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `level` enum('básico','intermediário','avançado') NOT NULL,
  `link_course` varchar(250) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `courses_name_unique` (`name`),
  KEY `courses_link_course_index` (`link_course`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES
(5,'Python','básico','https://www.ev.org.br/cursos/linguagem-de-programacao-python-basico','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(6,'JavaScript','básico','https://www.betrybe.com/curso-de-programacao-javascript-do-zero','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(7,'Java','básico','https://www.cursoemvideo.com/curso/java-basico/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(8,'C#','intermediário','https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(9,'C++','intermediário','https://www.udemy.com/course/cplusplus-intermediario/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(10,'PHP','básico','https://www.cursoemvideo.com/curso/php-basico/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(11,'TypeScript','avançado','https://www.cursou.com.br/informatica/programacao/typescript/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(12,'Go','avançado','https://go.dev/doc/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(13,'Rust','básico','https://labex.io/pt/courses/quick-start-with-rust','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(14,'Swift','básico','https://www.cursou.com.br/informatica/programacao/swift/#player','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(15,'Ruby','intermediário','https://www.cursou.com.br/informatica/ruby/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(16,'C','básico','https://www.realizzarecursos.com.br/cursos/curso-de-linguagem-c-gratuito/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(17,'Lua','básico','https://www.cursou.com.br/informatica/programacao/programacao-lua/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(18,'HTML / CSS','intermediário','https://www.ev.org.br/cursos/crie-um-site-simples-usando-html-css-e-javascript','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(19,'SQL','intermediário','https://www.ev.org.br/cursos/implementando-banco-de-dados','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(20,'Git / GitHub','básico','https://www.cursoemvideo.com/curso/curso-de-git-e-github/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(21,'Docker','básico','https://www.udemy.com/pt/topic/docker/free/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(22,'Bash','básico','https://cursa.app/pt/curso-gratuito/shell-script-bbbh','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL),
(23,'PowerShell','básico','https://www.cursou.com.br/informatica/windows-powershell/','2026-07-07 19:30:20','2026-07-07 19:30:20',NULL);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(23,'0001_01_01_000000_create_users_table',1),
(24,'0001_01_01_000001_create_cache_table',1),
(25,'0001_01_01_000002_create_jobs_table',1),
(26,'2024_01_01_000000_create_passkeys_table',1),
(27,'2025_08_14_170933_add_two_factor_columns_to_users_table',1),
(28,'2026_05_28_011606_create_personal_access_tokens_table',1),
(29,'2026_05_28_013548_add_two_factor_columns_to_users_table',1),
(30,'2026_06_06_142710_create_trails_table',1),
(31,'2026_06_06_143439_create_courses_table',1),
(32,'2026_06_06_154955_create_trail_courses_table',1),
(33,'2026_06_06_202646_create_user_trails_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `passkeys`
--

DROP TABLE IF EXISTS `passkeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `passkeys` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `credential_id` varchar(255) NOT NULL,
  `credential` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`credential`)),
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `passkeys_credential_id_unique` (`credential_id`),
  KEY `passkeys_user_id_index` (`user_id`),
  CONSTRAINT `passkeys_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passkeys`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `passkeys` WRITE;
/*!40000 ALTER TABLE `passkeys` DISABLE KEYS */;
/*!40000 ALTER TABLE `passkeys` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `trail_courses`
--

DROP TABLE IF EXISTS `trail_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `trail_courses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `trail_id` bigint(20) unsigned NOT NULL,
  `course_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trail_courses_course_id_foreign` (`course_id`),
  KEY `trail_courses_trail_id_course_id_index` (`trail_id`,`course_id`),
  CONSTRAINT `trail_courses_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trail_courses_trail_id_foreign` FOREIGN KEY (`trail_id`) REFERENCES `trails` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trail_courses`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `trail_courses` WRITE;
/*!40000 ALTER TABLE `trail_courses` DISABLE KEYS */;
INSERT INTO `trail_courses` VALUES
(1,2,6,'2026-07-07 19:30:39','2026-07-07 19:30:39'),
(2,2,11,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(3,2,18,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(4,2,20,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(5,3,5,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(6,3,6,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(7,3,7,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(8,3,8,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(9,3,10,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(10,3,12,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(11,3,15,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(12,3,19,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(13,3,20,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(14,3,21,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(15,3,22,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(16,3,23,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(17,4,6,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(18,4,7,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(19,4,8,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(20,4,14,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(21,4,20,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(22,5,5,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(23,5,6,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(24,5,11,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(25,5,18,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(26,5,19,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(27,5,20,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(28,5,21,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(29,5,22,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(30,5,23,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(31,6,5,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(32,6,19,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(33,6,20,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(34,7,5,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(35,7,12,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(36,7,20,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(37,7,21,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(38,7,22,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(39,7,23,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(40,8,5,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(41,8,7,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(42,8,9,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(43,8,17,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(44,9,5,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(45,9,6,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(46,9,9,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(47,9,16,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(48,9,19,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(49,9,22,'2026-07-07 19:30:40','2026-07-07 19:30:40'),
(50,9,23,'2026-07-07 19:30:40','2026-07-07 19:30:40');
/*!40000 ALTER TABLE `trail_courses` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `trails`
--

DROP TABLE IF EXISTS `trails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `trails` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trails_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trails`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `trails` WRITE;
/*!40000 ALTER TABLE `trails` DISABLE KEYS */;
INSERT INTO `trails` VALUES
(2,'Desenvolvimento Frontend','2026-07-07 19:28:46','2026-07-07 19:28:46'),
(3,'Desenvolvimento Backend','2026-07-07 19:28:46','2026-07-07 19:28:46'),
(4,'Desenvolvimento Mobile','2026-07-07 19:28:46','2026-07-07 19:28:46'),
(5,'Desenvolvimento Full Stack','2026-07-07 19:28:46','2026-07-07 19:28:46'),
(6,'Ciência de Dados','2026-07-07 19:28:46','2026-07-07 19:28:46'),
(7,'DevOps e Cloud','2026-07-07 19:28:46','2026-07-07 19:28:46'),
(8,'Inteligência Artificial','2026-07-07 19:28:46','2026-07-07 19:28:46'),
(9,'Segurança da Informação','2026-07-07 19:28:46','2026-07-07 19:28:46'),
(10,'Trilha Teste (p/ deletar)','2026-07-07 20:22:48','2026-07-07 20:22:48'),
(11,'Computação em Nuvem (AWS)',NULL,NULL),
(12,'Interconexão e Serviços de Redes (ISR)',NULL,NULL);
/*!40000 ALTER TABLE `trails` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `user_trails`
--

DROP TABLE IF EXISTS `user_trails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_trails` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `trail_id` bigint(20) unsigned NOT NULL,
  `progress` enum('Inscrito','Cursando','Suspenso','Concluído') NOT NULL DEFAULT 'Inscrito',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_trails_trail_id_foreign` (`trail_id`),
  KEY `user_trails_user_id_trail_id_index` (`user_id`,`trail_id`),
  CONSTRAINT `user_trails_trail_id_foreign` FOREIGN KEY (`trail_id`) REFERENCES `trails` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_trails_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_trails`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `user_trails` WRITE;
/*!40000 ALTER TABLE `user_trails` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_trails` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `role` enum('user','admin','root') NOT NULL DEFAULT 'user',
  `birth_date` date DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `two_factor_confirmed_at` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Administrador Root','root@email.com','2026-07-07 20:22:48','root','1968-12-17','629.755.4723','$2y$12$/5x0R5LSGr2974lpOCEBtOf.ca8k0yM4noCZSaU8p2rK.2SoRiDOa',NULL,NULL,NULL,'tiHU2mEIGi','2026-07-07 20:22:48','2026-07-07 20:22:48'),
(2,'Administrador 01','adm@email.com','2026-07-07 20:22:48','admin','1999-04-03','+18176302940','$2y$12$neawZv4KkzKIiK258WYhV.oAytwvuUDl.mq7KTbKjC0wsM4.sZ8fe',NULL,NULL,NULL,'U1Pfcql5Ym','2026-07-07 20:22:48','2026-07-07 20:22:48');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-07-07 14:35:13
