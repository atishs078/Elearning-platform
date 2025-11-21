package com.quitecodedevelopers.elearning.service.impl;

import com.quitecodedevelopers.elearning.exception.ResourceNotFoundException;
import com.quitecodedevelopers.elearning.model.Assignment;
import com.quitecodedevelopers.elearning.model.Submission;
import com.quitecodedevelopers.elearning.repository.AssignmentRepository;
import com.quitecodedevelopers.elearning.repository.SubmissionRepository;
import com.quitecodedevelopers.elearning.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional; // Import Optional

@Service
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Override
    public Assignment createAssignment(Assignment a) {
        return assignmentRepository.save(a);
    }

    @Override
    public List<Assignment> getAssignmentsForCourse(String courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }


    @Override
    public Assignment getAssignmentById(String assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + assignmentId));
    }


    @Override
    public Submission submitAssignment(Submission s) {

        Optional<Submission> existing = submissionRepository
                .findByAssignmentId(s.getAssignmentId())
                .stream()
                .filter(sub -> sub.getStudentEmail().equals(s.getStudentEmail()))
                .findFirst();

        if (existing.isPresent()) {
            throw new RuntimeException("You already submitted this assignment");
        }

        s.setStatus("SUBMITTED");
        s.setSubmittedAt(new Date(System.currentTimeMillis()));
        return submissionRepository.save(s);
    }

    @Override
    public List<Submission> getSubmissionsForAssignment(String assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    @Override
    public List<Submission> getSubmissionForStudent(String studentEmail) {
        return submissionRepository.findByStudentEmail(studentEmail);
    }

    @Override
    public Submission gradeSubmission(String submissionId, Double grade, String feedback) {
        Submission s = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with ID: " + submissionId)); // Using custom exception here too

        s.setGrade(grade);
        s.setFeedback(feedback);
        s.setStatus("GRADED");

        return submissionRepository.save(s);
    }
}