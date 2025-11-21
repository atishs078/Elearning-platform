package com.quitecodedevelopers.elearning.service;

import com.quitecodedevelopers.elearning.model.Assignment;
import com.quitecodedevelopers.elearning.model.Submission;

import java.util.List;

public interface AssignmentService {
    Assignment createAssignment (Assignment a);
    List<Assignment> getAssignmentsForCourse(String courseId);
    Submission submitAssignment (Submission s);
    List<Submission> getSubmissionsForAssignment (String assignmentId);
    List<Submission> getSubmissionForStudent(String studentEmail);
    Submission gradeSubmission(String submissionId, Double grade, String feedback);
    Assignment getAssignmentById(String assignmentId);
}
