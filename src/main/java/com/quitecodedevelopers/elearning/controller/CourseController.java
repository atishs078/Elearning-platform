package com.quitecodedevelopers.elearning.controller;

import com.quitecodedevelopers.elearning.model.Course;
import com.quitecodedevelopers.elearning.model.dto.CourseRequest;
import com.quitecodedevelopers.elearning.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class CourseController {
    @Autowired
    private CourseService courseService;
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAll(@RequestParam(required = false) String category, @RequestParam(required = false) String title){
        if (category != null) return ResponseEntity.ok(courseService.searchByCategory(category));
        if (title != null) return ResponseEntity.ok(courseService.searchByTitle(title));
        return ResponseEntity.ok(courseService.getAllCourse());
    }
    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getByID(@PathVariable String id){
        return ResponseEntity.ok(courseService.getCourseById(id));

    }

    @PostMapping("/admin/courses")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CourseRequest request){
        Course saved = courseService.createCourse(request);
        return ResponseEntity.ok(saved);
    }
    @PutMapping("/admin/courses/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @Valid @RequestBody CourseRequest request){
        Course updated = courseService.updateCourse(id, request);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/admin/courses/{id}")
    public ResponseEntity<Map<String, String>> deleteCourse(@PathVariable String id){
        courseService.deleteCourse(id);
        return ResponseEntity.ok(Map.of("message","Course Deleted"));
    }
}
