package com.quitecodedevelopers.elearning.service.impl;

import com.quitecodedevelopers.elearning.exception.ResourceNotFoundException;
import com.quitecodedevelopers.elearning.model.Course;
import com.quitecodedevelopers.elearning.model.dto.CourseRequest;
import com.quitecodedevelopers.elearning.repository.CourseRepository;
import com.quitecodedevelopers.elearning.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {
    @Autowired
    private CourseRepository courseRepository;
    @Override
    public Course createCourse(CourseRequest req){
        Course c= new Course();
        c.setTitle(req.getTitle());
        c.setShortDescription(req.getShortDescription());
        c.setDescription(req.getDescription());
        c.setCategory(req.getCategory());
        c.setPrice(req.getPrice());
        c.setThumbnailUrl(req.getThumbnailUrl());
        return courseRepository.save(c);
    }

    @Override
    public Course updateCourse(String id, CourseRequest req){
        Course existing = courseRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Course Not Found with id: "+id));
        existing.setTitle(req.getTitle());
        existing.setShortDescription(req.getShortDescription());
        existing.setDescription(req.getDescription());
        existing.setCategory(req.getCategory());
        existing.setPrice(req.getPrice());
        existing.setThumbnailUrl(req.getThumbnailUrl());
        return courseRepository.save(existing);

    }
    @Override
    public void deleteCourse(String id){
        Course existing = courseRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Course Not found with id: "+id));
        courseRepository.delete(existing);
    }
    @Override
    public Course getCourseById(String id){
        return courseRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Course Not found with id: "+id));

    }
    @Override
    public List<Course> getAllCourse(){
        return courseRepository.findAll();
    }
    @Override
    public List<Course> searchByCategory(String category){
        return courseRepository.findByCategoryIgnoreCase(category);

    }
    @Override
    public List<Course> searchByTitle(String title){
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }

}
