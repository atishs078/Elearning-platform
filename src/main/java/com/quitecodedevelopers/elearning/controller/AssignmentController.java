package com.quitecodedevelopers.elearning.controller;

import com.quitecodedevelopers.elearning.model.Assignment;
import com.quitecodedevelopers.elearning.model.Submission;
import com.quitecodedevelopers.elearning.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class AssignmentController {
    @Autowired
    private AssignmentService assignmentService;

    // 1. ADMIN: Create a new assignment for a course
    @PostMapping("/admin/courses/{courseId}/assignment")
    public ResponseEntity<Assignment> createAssignment(@PathVariable String courseId, @RequestBody Assignment a){
        a.setCourseId(courseId);
        return ResponseEntity.ok(assignmentService.createAssignment(a));
    }

    // 2. PUBLIC/STUDENT: Get all assignments for a specific course
    @GetMapping("/courses/{courseId}/assignments")
    public ResponseEntity<List<Assignment>> getForCourse(@PathVariable String courseId){
        return  ResponseEntity.ok(assignmentService.getAssignmentsForCourse(courseId));
    }

    // 3. STUDENT: Get details for a single assignment by ID (THE MISSING API)
    @GetMapping("/assignments/{assignmentId}")
    public ResponseEntity<Assignment> getAssignmentDetails(@PathVariable String assignmentId) {
        // This relies on your AssignmentService having a method like getAssignmentById(String id)
        Assignment assignment = assignmentService.getAssignmentById(assignmentId);

        // Handle case where assignment is not found
        if (assignment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(assignment);
    }

    // 4. STUDENT: Submit an assignment link
    @PostMapping("/assignments/{assignmentId}/submit")
    public ResponseEntity<Submission> submit(@PathVariable String assignmentId, @RequestBody Submission s, Authentication authentication){
        s.setAssignmentId(assignmentId);
        s.setStudentEmail(authentication.getName());
        return ResponseEntity.ok(assignmentService.submitAssignment(s));
    }

    // 5. ADMIN: Get all submissions for a specific assignment
    @GetMapping("/admin/assignments/{assignmentId}/submission")
    public ResponseEntity<List<Submission>> getSubmission(@PathVariable String assignmentId){
        return ResponseEntity.ok(assignmentService.getSubmissionsForAssignment(assignmentId));
    }

    // 6. ADMIN: Grade a submission
    @PostMapping("/admin/submissions/{submissionId}/grade")
    public ResponseEntity<Submission> grade(@PathVariable String submissionId, @RequestBody Map<String, Object>body){
        // Ensure proper error handling/validation for parsing the grade in a production app
        Double grade = Double.parseDouble(body.get("grade").toString());
        String feedback = (String) body.getOrDefault("feedback","");
        return ResponseEntity.ok(assignmentService.gradeSubmission(submissionId, grade, feedback));
    }

    // 7. STUDENT: Get all submissions made by the currently authenticated user
    @GetMapping("/users/me/submissions")
    public ResponseEntity<List<Submission>> mySubmission(Authentication authentication){
        return ResponseEntity.ok(assignmentService.getSubmissionForStudent(authentication.getName()));
    }
}