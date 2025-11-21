package com.quitecodedevelopers.elearning.repository;

import com.quitecodedevelopers.elearning.model.Lecture;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LectureRepository extends MongoRepository<Lecture,String> {
    List<Lecture> findByCourseIdOrderByOrderIndexAsc(String courseId);
}

