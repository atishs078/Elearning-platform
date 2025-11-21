package com.quitecodedevelopers.elearning.service.impl;

import com.quitecodedevelopers.elearning.exception.ResourceNotFoundException;
import com.quitecodedevelopers.elearning.model.Course;
import com.quitecodedevelopers.elearning.model.User;
import com.quitecodedevelopers.elearning.repository.CourseRepository;
import com.quitecodedevelopers.elearning.repository.UserRepository;
import com.quitecodedevelopers.elearning.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Override
    public void Enroll(String userEmail, String courseId){
        User user = userRepository.findByEmail(userEmail);
        if(user==null) throw new ResourceNotFoundException("User Not Found");
        Course course = courseRepository.findById(courseId).orElseThrow(()->new ResourceNotFoundException("Course not found"));
        if(!user.getEnrolledCourse().contains(courseId)){
            user.getEnrolledCourse().add(courseId);
            user.getCourseProgress().put(courseId,0.0);
            userRepository.save(user);
        }
    }
    @Override
    public List<String> getEnrolledCourseIds(String userEmail){
        User user = userRepository.findByEmail(userEmail);
        if(user == null) throw new ResourceNotFoundException("User Not Found");
        return user.getEnrolledCourse();
    }
    @Override
    public void unenroll(String userEmail, String courseId){
        User user = userRepository.findByEmail(userEmail);
        if (user == null) throw new ResourceNotFoundException("User Not Found");
        user.getEnrolledCourse().remove(courseId);
        user.getCourseProgress().remove(courseId);
        userRepository.save(user);
    }
    @Override
    public void updateProgress(String userEmail, String courseId, double percent){
        User user = userRepository.findByEmail(userEmail);
        if (user == null) throw new ResourceNotFoundException("User Not Found");
        user.getCourseProgress().put(courseId, Math.max(0,Math.min(100.0,percent)));
        userRepository.save(user);
    }
    @Override
    public Map<String, Double> getProgressMap(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) throw new ResourceNotFoundException("User Not Found");
        return user.getCourseProgress(); // Assuming User model has Map<String, Double> getCourseProgress()
    }

}
