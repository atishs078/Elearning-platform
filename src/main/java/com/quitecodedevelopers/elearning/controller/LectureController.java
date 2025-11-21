package com.quitecodedevelopers.elearning.controller;

import com.quitecodedevelopers.elearning.model.Lecture;
import com.quitecodedevelopers.elearning.service.LectureService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class LectureController {
    @Autowired
    private LectureService lectureService;

    @PostMapping("/admin/lectures")
    public ResponseEntity<Lecture> addLecture (@Valid @RequestBody Lecture lecture){
        Lecture saved = lectureService.addLecture(lecture);
        return ResponseEntity.ok(saved);
    }
    @PutMapping("/admin/lectures/{id}")
    public ResponseEntity<Lecture> updateLecture(@PathVariable String id, @Valid @RequestBody Lecture lecture){
        return ResponseEntity.ok(lectureService.updateLecture(id, lecture));
    }
    @DeleteMapping("/admin/lectures/{id}")
    public ResponseEntity<?> deleteLecture(@PathVariable String id){
        lectureService.deleteLecture(id);
        return ResponseEntity.ok(Map.of("message","Lecture Deleted"));
    }
    @GetMapping("/courses/{courseId}/lectures")
    public ResponseEntity<List<Lecture>> getByCourse(@PathVariable String courseId){
        return ResponseEntity.ok(lectureService.getLectureByCourse(courseId));
    }
    @GetMapping("/lectures/{id}")
    public ResponseEntity<Lecture> getById(@PathVariable String id){
        return ResponseEntity.ok(lectureService.getById(id));
    }
}
