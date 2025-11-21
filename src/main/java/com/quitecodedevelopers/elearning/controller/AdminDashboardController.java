package com.quitecodedevelopers.elearning.controller;

import com.quitecodedevelopers.elearning.repository.AssignmentRepository;
import com.quitecodedevelopers.elearning.repository.CourseRepository;
import com.quitecodedevelopers.elearning.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminDashboardController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private AssignmentRepository assignmentRepository;
    @GetMapping("/dashboard-data")
    public ResponseEntity<Map<String, Object>> getDashboard(){
        long users = userRepository.count();
        long course = courseRepository.count();
        long assignment = assignmentRepository.count();
        var agg = courseRepository.findAll();
        Map<String, Long> byCategory = agg.stream().collect(
                java.util.stream.Collectors.groupingBy(c->c.getCategory ()==null ? "Uncategorized" : c.getCategory(),
                java.util.stream.Collectors.counting())

        );
                return ResponseEntity.ok(Map.of(
                        "users", users,
                        "courses", course,
                        "assignment", assignment,
                        "courseByCategory", byCategory
                ));
    }
}
