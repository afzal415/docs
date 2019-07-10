
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `roles` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) NOT NULL,
  `group_desc` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `user_groups_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS `surveys` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `results_table` varchar(100) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL,
  `is_dual` tinyint(4) DEFAULT NULL,
  `drafts_table` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS `all_questions` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `prompt` varchar(255) NOT NULL,
  `alias` varchar(255) NOT NULL,
  `type` varchar(8) NOT NULL,
  `required` tinyint(1) NOT NULL,
  `choices` varchar(255) NOT NULL,
  `condition_question` varchar(255) DEFAULT NULL,
  `prompt_bm` varchar(255) DEFAULT NULL,
  `choices_bm` varchar(255) DEFAULT NULL,
  `condition_question_bm` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `assessments_to_users` (
  `user_id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `for_user` int(11) NOT NULL,
  `completion_status` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `exams_to_users` (
  `user_id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `completion_status` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `exam_qa` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) DEFAULT NULL,
  `type_of_ques` varchar(20) DEFAULT NULL,
  `db_column` varchar(60) DEFAULT NULL,
  `choices` varchar(255) DEFAULT NULL,
  `answer` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `skills` (
  `skill_id` int(11) NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`skill_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `exam_qa_skill` (
  `exam_question_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  KEY `exam_question_id` (`exam_question_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `exam_qa_skill_ibfk_1` FOREIGN KEY (`exam_question_id`) REFERENCES `exam_qa` (`question_id`),
  CONSTRAINT `exam_qa_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `exam_type` (
  `survey_id` int(11) NOT NULL,
  `exam_type` varchar(255) DEFAULT NULL,
  KEY `survey_id` (`survey_id`),
  CONSTRAINT `exam_type_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `group_members` (
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  KEY `group_id` (`group_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`group_id`),
  CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `g_edges` (
  `n1` int(11) NOT NULL,
  `n2` int(11) NOT NULL,
  `attribute` varchar(100) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `g_nodes` (
  `id` int(11) NOT NULL,
  `attribute` varchar(100) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
  `user_id` int(11) NOT NULL,
  `notification_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;




CREATE TABLE IF NOT EXISTS `surveys_to_users` (
  `user_id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `completion_status` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



CREATE TABLE IF NOT EXISTS `survey_approvals` (
  `survey_id` int(11) NOT NULL,
  `approver_id` int(11) NOT NULL,
  `justification` varchar(255) NOT NULL,
  `approver_comments` varchar(255) DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  KEY `survey_id` (`survey_id`),
  KEY `approver_id` (`approver_id`),
  CONSTRAINT `survey_approvals_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`),
  CONSTRAINT `survey_approvals_ibfk_2` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `survey_collaborators` (
  `survey_id` int(11) DEFAULT NULL,
  `collaborator_id` int(11) DEFAULT NULL,
  KEY `collaborator_id` (`collaborator_id`),
  CONSTRAINT `survey_collaborators_ibfk_1` FOREIGN KEY (`collaborator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS `survey_exam_qa_ref` (
  `survey_id` int(11) NOT NULL,
  `exam_question_id` int(11) NOT NULL,
  KEY `survey_id` (`survey_id`),
  KEY `exam_question_id` (`exam_question_id`),
  CONSTRAINT `survey_exam_qa_ref_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`),
  CONSTRAINT `survey_exam_qa_ref_ibfk_2` FOREIGN KEY (`exam_question_id`) REFERENCES `exam_qa` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `survey_groups` (
  `survey_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  KEY `group_id` (`group_id`),
  KEY `survey_id` (`survey_id`),
  CONSTRAINT `survey_groups_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`group_id`),
  CONSTRAINT `survey_groups_ibfk_2` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `survey_individuals` (
  `survey_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `survey_id` (`survey_id`),
  CONSTRAINT `survey_individuals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `survey_individuals_ibfk_2` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `survey_questions` (
  `survey_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `prompt` varchar(255) NOT NULL,
  `alias` varchar(255) NOT NULL,
  `type` varchar(8) NOT NULL,
  `required` tinyint(1) NOT NULL,
  `choices` varchar(255) NOT NULL,
  `all_questions_id` int(11) NOT NULL,
  `sort_order` int(11) DEFAULT '0',
  `condition_question` varchar(255) DEFAULT NULL,
  `condition_question_bm` varchar(255) DEFAULT NULL,
  `prompt_bm` varchar(255) DEFAULT NULL,
  `choices_bm` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `survey_id` (`survey_id`),
  KEY `all_questions_id` (`all_questions_id`),
  CONSTRAINT `survey_questions_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`),
  CONSTRAINT `survey_questions_ibfk_2` FOREIGN KEY (`all_questions_id`) REFERENCES `all_questions` (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `tags_questions` (
  `tag_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  KEY `tag_id` (`tag_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `tags_questions_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),
  CONSTRAINT `tags_questions_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `all_questions` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_downloads` (
  `user_id` int(11) DEFAULT NULL,
  `survey_id` int(11) DEFAULT NULL,
  `download_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `survey_enquiries` (
	`enq_id` INT(11) NOT NULL AUTO_INCREMENT,
	`survey_id` INT(11) NOT NULL,
	`user_id` INT(11) NOT NULL,
	`enquiries` VARCHAR(200) NOT NULL DEFAULT '' COLLATE 'utf8_unicode_ci',
	`status` VARCHAR(30) NOT NULL DEFAULT '1' COLLATE 'utf8_unicode_ci',
	`created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`enq_id`),
	INDEX `FK_SurveyId` (`survey_id`),
	INDEX `FK_UserId` (`user_id`),
	CONSTRAINT `FK_SurveyId` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`),
	CONSTRAINT `FK_UserId` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
)
COLLATE='utf8_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1
;


ALTER TABLE `all_questions`
	ADD COLUMN `image_url` VARCHAR(255) NULL DEFAULT NULL AFTER `condition_question`;
	
ALTER TABLE `survey_questions `
	ADD COLUMN `image_url` VARCHAR(255) NULL DEFAULT NULL AFTER `condition_question`;
	
ALTER TABLE `surveys`
	ADD COLUMN `user_limit` INT(10) NULL AFTER `expiry_date`;
	
ALTER TABLE `surveys`
	ADD COLUMN `page_type` VARCHAR(30) NULL AFTER `type`;
	
ALTER TABLE `surveys`
	ADD COLUMN `message` VARCHAR(255) NULL AFTER `created_by`;

ALTER TABLE `surveys`
	ADD COLUMN `fonts` VARCHAR(100) NULL AFTER `created_by`;

-- Increasing the question size as the questions are big for some surveys
ALTER TABLE `survey_questions`
	CHANGE COLUMN `prompt` `prompt` VARCHAR(600) NOT NULL  AFTER `question_id`,
	CHANGE COLUMN `prompt_bm` `prompt_bm` VARCHAR(600) NULL DEFAULT NULL AFTER `condition_question_bm`;


ALTER TABLE `all_questions`
	CHANGE COLUMN `prompt` `prompt` VARCHAR(600) NOT NULL AFTER `question_id`,
	CHANGE COLUMN `prompt_bm` `prompt_bm` VARCHAR(600) NULL DEFAULT NULL AFTER `choices_bm`;

-- Matrix Question alteration
ALTER TABLE `all_questions`
	ADD COLUMN `Matrix_id` INT(11) NULL DEFAULT NULL AFTER `image_url`;

ALTER TABLE `survey_questions`
	ADD COLUMN `matrix_id` INT(11) NULL DEFAULT NULL AFTER `image_url`;

ALTER TABLE `survey_questions`
	ADD INDEX `matrix_id` (`matrix_id`);


CREATE TABLE IF NOT EXISTS `matrix_main_questions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `Main_Question` varchar(300) NOT NULL,
  `Main_question_bm` varchar(300) DEFAULT NULL,
  `Choices` varchar(300) NOT NULL,
  `Choices_bm` varchar(300) DEFAULT NULL,
  `mtype` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
)
COLLATE='utf8_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1

-- Update choices length to 400
ALTER TABLE `survey_questions`
	CHANGE COLUMN `choices` `choices` VARCHAR(400) NOT NULL COLLATE 'utf8_unicode_ci' AFTER `required`,
	CHANGE COLUMN `choices_bm` `choices_bm` VARCHAR(400) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci' AFTER `prompt_bm`;

ALTER TABLE `all_questions`
	CHANGE COLUMN `choices` `choices` VARCHAR(400) NOT NULL COLLATE 'utf8_unicode_ci' AFTER `required`,
	CHANGE COLUMN `choices_bm` `choices_bm` VARCHAR(400) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci' AFTER `prompt_bm`;

