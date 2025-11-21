package com.quitecodedevelopers.elearning.controller;

import com.quitecodedevelopers.elearning.model.User;
import com.quitecodedevelopers.elearning.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users/me")
@CrossOrigin(origins = "*")
public class ProfileCotroller {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @GetMapping("")
    public ResponseEntity<User> me(Authentication authentication){
        User u = userRepository.findByEmail(authentication.getName());
        if (u == null){
            return ResponseEntity.notFound().build();


        }
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }
    @PutMapping("/update")
    public ResponseEntity<User> update (@Valid @RequestBody User payload, Authentication authentication){
        User u = userRepository.findByEmail(authentication.getName());
        u.setName(payload.getName());
        userRepository.save(u);
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> body, Authentication authentication){
        String oldPwd = body.get("oldPassword");
        String newPwd = body.get("newPassword");
        User u = userRepository.findByEmail(authentication.getName());
        if (u == null) return ResponseEntity.status(404).body(Map.of("error", "user not found"));
        if (!passwordEncoder.matches(oldPwd, u.getPassword())) return ResponseEntity.status(400).body(Map.of("error","Old password incorrect"));
        u.setPassword(passwordEncoder.encode(newPwd));
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "Password CHanged"));
    }
}
