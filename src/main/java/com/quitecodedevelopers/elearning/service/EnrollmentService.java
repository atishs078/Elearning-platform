package com.quitecodedevelopers.elearning.service;

import java.util.List;
import java.util.Map; // Import Map

public interface EnrollmentService {
    void Enroll(String userEmail, String courseID);
    List<String> getEnrolledCourseIds(String userEmail);
    void unenroll(String userEmail, String courseId);
    void updateProgress(String userEmail, String courseID, double percent);

    // ✅ NEW METHOD: Get the progress map for all enrolled courses
    Map<String, Double> getProgressMap(String userEmail);
}