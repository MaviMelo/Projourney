-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: projourney_php
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- CONFIGURAÇÕES:
--
-- mysql -u <usuário> -p < db_backup_projourney_php.sql
--
-- CREATE USER '<userName>'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>';
--
-- ALTER USER '<userName>'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>'; 
--
--
--


CREATE DATABASE projourney_php;
USE projourney_php;


--
-- Table structure for table `aluno_experiencia`
--

DROP TABLE IF EXISTS `aluno_experiencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aluno_experiencia` (
  `experiencia_id` int NOT NULL,
  `aluno_id` int NOT NULL,
  PRIMARY KEY (`experiencia_id`,`aluno_id`),
  KEY `aluno_id` (`aluno_id`),
  CONSTRAINT `aluno_experiencia_ibfk_1` FOREIGN KEY (`experiencia_id`) REFERENCES `experiencia` (`id`),
  CONSTRAINT `aluno_experiencia_ibfk_2` FOREIGN KEY (`aluno_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aluno_experiencia`
--

LOCK TABLES `aluno_experiencia` WRITE;
/*!40000 ALTER TABLE `aluno_experiencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `aluno_experiencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `nivel` enum('Basico','Intermediario','Avançado') NOT NULL,
  `link_curso` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (5,'Python','Basico','https://www.ev.org.br/cursos/linguagem-de-programacao-python-basico'),(6,'JavaScript','Basico','https://www.betrybe.com/curso-de-programacao-javascript-do-zero'),(7,'Java','Basico','https://www.cursoemvideo.com/curso/java-basico/'),(8,'C#','Intermediario','https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/'),(9,'C++','Intermediario','https://www.udemy.com/course/cplusplus-intermediario/'),(10,'PHP','Basico','https://www.cursoemvideo.com/curso/php-basico/'),(11,'TypeScript.','Avançado','https://www.cursou.com.br/informatica/programacao/typescript/'),(12,'Go','Avançado','https://go.dev/doc/'),(13,'Rust','Basico','https://labex.io/pt/courses/quick-start-with-rust'),(14,'Swift','Basico','https://www.cursou.com.br/informatica/programacao/swift/#player'),(15,'Ruby','Intermediario','https://www.cursou.com.br/informatica/ruby/'),(16,'C','Basico','https://www.realizzarecursos.com.br/cursos/curso-de-linguagem-c-gratuito/'),(17,'Lua','Basico','https://www.cursou.com.br/informatica/programacao/programacao-lua/'),(18,'HTML / CSS','Intermediario','https://www.ev.org.br/cursos/crie-um-site-simples-usando-html-css-e-javascript'),(19,'SQL','Intermediario','https://www.ev.org.br/cursos/implementando-banco-de-dados'),(20,'Git / GitHub','Basico','https://www.cursoemvideo.com/curso/curso-de-git-e-github/'),(21,'Docker','Basico','https://www.udemy.com/pt/topic/docker/free/'),(22,'Bash','Basico','https://cursa.app/pt/curso-gratuito/shell-script-bbbh'),(23,'PowerShell','Basico','https://www.cursou.com.br/informatica/windows-powershell/');
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso_trilha`
--

DROP TABLE IF EXISTS `curso_trilha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso_trilha` (
  `curso_id` int NOT NULL,
  `trilha_id` int NOT NULL,
  PRIMARY KEY (`curso_id`,`trilha_id`),
  KEY `trilha_id` (`trilha_id`),
  CONSTRAINT `curso_trilha_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`),
  CONSTRAINT `curso_trilha_ibfk_2` FOREIGN KEY (`trilha_id`) REFERENCES `trilha` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso_trilha`
--

LOCK TABLES `curso_trilha` WRITE;
/*!40000 ALTER TABLE `curso_trilha` DISABLE KEYS */;
INSERT INTO `curso_trilha` VALUES (6,2),(11,2),(18,2),(20,2),(5,3),(6,3),(7,3),(8,3),(10,3),(12,3),(15,3),(19,3),(20,3),(21,3),(22,3),(23,3),(6,4),(7,4),(8,4),(14,4),(20,4),(5,5),(6,5),(11,5),(18,5),(19,5),(20,5),(21,5),(22,5),(23,5),(5,6),(19,6),(20,6),(5,7),(12,7),(20,7),(21,7),(22,7),(23,7),(5,8),(7,8),(9,8),(17,8),(5,9),(6,9),(9,9),(16,9),(19,9),(22,9),(23,9);
/*!40000 ALTER TABLE `curso_trilha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiencia`
--

DROP TABLE IF EXISTS `experiencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencia`
--

LOCK TABLES `experiencia` WRITE;
/*!40000 ALTER TABLE `experiencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trilha`
--

DROP TABLE IF EXISTS `trilha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trilha` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trilha`
--

LOCK TABLES `trilha` WRITE;
/*!40000 ALTER TABLE `trilha` DISABLE KEYS */;
INSERT INTO `trilha` VALUES (2,'Desenvolvimento Frontend'),(3,'Desenvolvimento Backend'),(4,'Desenvolvimento Mobile'),(5,'Desenvolvimento Full Stack'),(6,'Ciência de Dados'),(7,'DevOps e Cloud'),(8,'Inteligência Artificial'),(9,'Segurança da Informação');
/*!40000 ALTER TABLE `trilha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trilha_aluno`
--

DROP TABLE IF EXISTS `trilha_aluno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trilha_aluno` (
  `trilha_id` int NOT NULL,
  `aluno_id` int NOT NULL,
  `progresso` enum('Inscrito','Cursando','Suspenso','Concluido') NOT NULL DEFAULT 'Inscrito',
  KEY `trilha_id` (`trilha_id`),
  KEY `aluno_id` (`aluno_id`),
  CONSTRAINT `trilha_aluno_ibfk_1` FOREIGN KEY (`trilha_id`) REFERENCES `trilha` (`id`),
  CONSTRAINT `trilha_aluno_ibfk_2` FOREIGN KEY (`aluno_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trilha_aluno`
--

LOCK TABLES `trilha_aluno` WRITE;
/*!40000 ALTER TABLE `trilha_aluno` DISABLE KEYS */;
/*!40000 ALTER TABLE `trilha_aluno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(300) NOT NULL,
  `tipo` enum('admin','user') NOT NULL DEFAULT 'user',
  `data_nascimento` date DEFAULT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `USERS_EMAIL_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@gmail.com','$argon2id$v=19$m=65536,t=4,p=1$1KAOOnHG1L2dpqOaV9Wdpw$JBasxz0RhKgyYR7YllvIhSRmwF/GF0MO+l/Uny6qcwg','user',NULL,'','2026-03-14 20:03:07','2026-03-14 20:03:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-15 17:32:13
