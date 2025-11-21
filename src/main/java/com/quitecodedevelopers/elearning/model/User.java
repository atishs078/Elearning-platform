package com.quitecodedevelopers.elearning.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    private String name;
    private String email;
    private String password;
    private String role;

    public User(String name, String email, String password, String role){
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    private List<String> enrolledCourse = new ArrayList<>();

    public Map<String, Double> getCourseProgress() {
        return courseProgress;
    }

    public void setCourseProgress(Map<String, Double> courseProgress) {
        this.courseProgress = courseProgress;
    }

    public List<String> getEnrolledCourse() {
        return enrolledCourse;
    }

    public void setEnrolledCourse(List<String> enrolledCourse) {
        this.enrolledCourse = enrolledCourse;
    }

    private Map<String, Double> courseProgress = new HashMap<>();

}
