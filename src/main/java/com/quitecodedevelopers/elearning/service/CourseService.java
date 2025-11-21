package com.quitecodedevelopers.elearning.service;

import com.quitecodedevelopers.elearning.model.Course;
import com.quitecodedevelopers.elearning.model.dto.CourseRequest;

import java.util.List;

public interface CourseService {
    Course createCourse(CourseRequest req);
    Course updateCourse(String id, CourseRequest req);
    void deleteCourse(String id);
    Course getCourseById(String id);
    List<Course> getAllCourse();
    List<Course> searchByCategory(String category);
    List<Course> searchByTitle(String title);
}

