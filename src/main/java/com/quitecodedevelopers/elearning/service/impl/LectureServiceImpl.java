package com.quitecodedevelopers.elearning.service.impl;

import com.quitecodedevelopers.elearning.exception.ResourceNotFoundException;
import com.quitecodedevelopers.elearning.model.Course;
import com.quitecodedevelopers.elearning.model.Lecture;
import com.quitecodedevelopers.elearning.repository.CourseRepository;
import com.quitecodedevelopers.elearning.repository.LectureRepository;
import com.quitecodedevelopers.elearning.service.LectureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LectureServiceImpl implements LectureService {
    @Autowired
    private LectureRepository lectureRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Override
    public Lecture addLecture(Lecture lecture){
        Course c= courseRepository.findById(lecture.getCourseId()).orElseThrow(()-> new ResourceNotFoundException("Course Not found "));
        Lecture saved = lectureRepository.save(lecture);
        List<String> lectures = c.getLectures();
        lectures.add(saved.getId());
        c.setLectures(lectures);
        courseRepository.save(c);
        return saved;

    }
    @Override
    public Lecture updateLecture(String id, Lecture lecture){
        Lecture existing = lectureRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Lecture Not Found"));
        existing.setTitle(lecture.getTitle());
        existing.setDescription(lecture.getDescription());
        existing.setVideoUrl(lecture.getVideoUrl());
        existing.setDurationSec(lecture.getDurationSec());
        existing.setOrderIndex(lecture.getOrderIndex());
        return lectureRepository.save(existing);
    }
    @Override
    public void deleteLecture(String id){
        Lecture existing = lectureRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Lecture not found"));
        Course c = courseRepository.findById(existing.getCourseId()).orElse(null);
        if (c!=null){
            c.getLectures().remove(existing.getId());
            courseRepository.save(c);
        }

        lectureRepository.delete(existing);
    }
    @Override
    public List<Lecture> getLectureByCourse(String courseId){
        return lectureRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }
    @Override
    public Lecture getById(String id){
        return lectureRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Lecture Not found"));
    }
}
