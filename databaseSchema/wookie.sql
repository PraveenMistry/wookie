-- MySQL dump 10.13  Distrib 5.7.27, for osx10.14 (x86_64)
--
-- Host: localhost    Database: wookie
-- ------------------------------------------------------
-- Server version	5.7.27

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(455) NOT NULL,
  `author` varchar(255) NOT NULL,
  `cover` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `is_published` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `books_unique` (`title`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'MARVEL','Marvel Endgame','Russo_brothers','Avengers: Endgame',700,1,2,'2020-01-29 16:46:28'),(2,'MARVEL 3','Marvel Endgame','Russo_brothers','Avengers: Endgame',700,1,1,'2020-01-30 16:25:54');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testme','$2b$10$//TPV.kHecz.fH7l3IkXNe0REmIk5GlvnfmGinHyefsoeTN2G7d52','2020-01-29 15:31:36'),(2,'Thanos','$2b$10$xqZVCJP/2KHWVn9tnLasQulk/uqejgrY47zZeUHGUNckH4LUoK14y','2020-01-29 16:41:48');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


-- Dump completed on 2020-01-30 22:53:50
