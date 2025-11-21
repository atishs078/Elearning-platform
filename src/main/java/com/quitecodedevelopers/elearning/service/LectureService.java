package com.quitecodedevelopers.elearning.service;

import com.quitecodedevelopers.elearning.model.Lecture;

import java.util.List;

public interface LectureService {
    Lecture addLecture(Lecture lecture);
    Lecture updateLecture(String id, Lecture lecture);
    void deleteLecture(String id);
    List<Lecture> getLectureByCourse(String courseId);
    Lecture getById(String id);
}
