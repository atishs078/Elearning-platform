package com.quitecodedevelopers.elearning.controller;

import com.quitecodedevelopers.elearning.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Import java.util.List
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class EnrollmentController {
    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<?> enroll(@PathVariable String courseId, Authentication authentication){
        String userEmail = authentication.getName();
        enrollmentService.Enroll(userEmail, courseId);
        return ResponseEntity.ok(Map.of("message","Enrolled Successfully"));
    }

    @DeleteMapping("/courses/{courseId}/unenroll")
    public ResponseEntity<?> unenroll(@PathVariable String courseId, Authentication authentication){
        String userEmail = authentication.getName();
        enrollmentService.unenroll(userEmail, courseId);
        return ResponseEntity.ok(Map.of("message", "UnEnrolled"));
    }

    @GetMapping("/users/me/courses/{courseId}/progress")
    public ResponseEntity<?> updateProgress(@PathVariable String courseId, @RequestBody Map<String, Object> body, Authentication authentication){
        String userEmail = authentication.getName();
        double percent = Double.parseDouble(body.get("percent").toString());
        enrollmentService.updateProgress(userEmail, courseId, percent);
        return ResponseEntity.ok(Map.of("message", "Progress updated"));
    }

    // ✅ NEW API: Endpoint to check enrolled courses
    @GetMapping("/users/me/enrolled")
    public ResponseEntity<List<String>> getEnrolledCourseIds(Authentication authentication) {
        String userEmail = authentication.getName();
        List<String> enrolledIds = enrollmentService.getEnrolledCourseIds(userEmail);
        return ResponseEntity.ok(enrolledIds);
    }
    @GetMapping("/users/me/progress")
    public ResponseEntity<Map<String, Double>> getUserProgress(Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Double> progressMap = enrollmentService.getProgressMap(userEmail);
        return ResponseEntity.ok(progressMap);
    }
}