-- MySQL dump 10.13  Distrib 5.7.27, for osx10.14 (x86_64)
--
-- Host: 127.0.0.1    Database: group_managing_db
-- ------------------------------------------------------
-- Server version	5.7.27

--
-- Table structure for table `group_album`
--

DROP TABLE IF EXISTS `group_album`;

CREATE TABLE `group_album` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `icon_path` varchar(150) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `group_album_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `group_list` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_list`
--

DROP TABLE IF EXISTS `group_list`;

CREATE TABLE `group_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(50) NOT NULL,
  `group_icon` varchar(150) NOT NULL DEFAULT '',
  `overview` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `group_list`
--

LOCK TABLES `group_list` WRITE;
INSERT INTO `group_list` VALUES (1,'test','','This is test group, this group for everyone who want to study programming but do not have any idea how to learn','2019-09-15 12:12:28','2019-09-15 12:13:57'),(2,'test2','','this is test2 group','2019-09-18 04:50:43','2019-09-18 04:50:43'),(6,'','','','2019-09-24 14:59:15','2019-09-24 14:59:15');
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;

CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `manager_flg` char(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `member_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `member_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group_list` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
INSERT INTO `member` VALUES (1,1,1,'1','2019-09-15 12:23:29','2019-09-15 12:23:29'),(2,2,2,'1','2019-09-17 15:04:13','2019-09-19 04:47:10'),(3,1,6,'1','2019-09-24 14:59:15','2019-09-24 14:59:15');
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
INSERT INTO `sessions` VALUES ('5yExumcQG8r7Z29XyavDbcIZEhk6b-RC',1569427186,'{\"cookie\":{\"originalMaxAge\":3600000,\"expires\":\"2019-09-25T15:53:17.509Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":{\"id\":1,\"user_name\":\"shinshin8\",\"password\":\"98d69b24b593dd2c04039ec2a724961b0393ed2cdf96e80cb6231614515f45cd\",\"mail_address\":\"doctor572@gmail.com\",\"icon_path\":\"\",\"autority_flg\":\"1\"}}}'),('DDfGF3vsEYqOq-x6HAfqJSMZjG2KGsFZ',1569405245,'{\"cookie\":{\"originalMaxAge\":3600000,\"expires\":\"2019-09-25T09:54:04.680Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{}}'),('NqzZKhs01MaRqw6TChz6fzzK2qg9EQVn',1569422107,'{\"cookie\":{\"originalMaxAge\":3600000,\"expires\":\"2019-09-25T14:34:53.007Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{}}'),('mw9q-fBpwXEyVXfqsc_hUtpkY2xA0mNL',1569421692,'{\"cookie\":{\"originalMaxAge\":3600000,\"expires\":\"2019-09-25T13:29:01.567Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}');
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `mail_address` varchar(100) NOT NULL,
  `icon_path` varchar(150) NOT NULL DEFAULT '',
  `autority_flg` char(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'shinshin8','98d69b24b593dd2c04039ec2a724961b0393ed2cdf96e80cb6231614515f45cd','doctor572@gmail.com','','1','2019-09-11 13:05:45','2019-09-23 15:44:23'),(2,'test1','test1','test1','','0','2019-09-17 15:03:47','2019-09-17 15:03:47');
UNLOCK TABLES;


-- Dump completed on 2019-09-26 10:52:41
