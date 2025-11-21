package com.quitecodedevelopers.elearning.repository;

import com.quitecodedevelopers.elearning.model.Submission;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByAssignmentId(String assignmentId);
    List<Submission> findByStudentEmail(String studentEmail);
}
