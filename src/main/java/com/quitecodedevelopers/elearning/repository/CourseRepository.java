package com.quitecodedevelopers.elearning.repository;

import com.quitecodedevelopers.elearning.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course,String> {
    List<Course> findByCategoryIgnoreCase(String category);
    List<Course> findByTitleContainingIgnoreCase(String title);
}
