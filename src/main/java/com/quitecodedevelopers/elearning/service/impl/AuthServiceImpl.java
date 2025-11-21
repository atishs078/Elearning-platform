package com.quitecodedevelopers.elearning.service.impl;

import com.quitecodedevelopers.elearning.model.User;
import com.quitecodedevelopers.elearning.model.dto.LoginRequest;
import com.quitecodedevelopers.elearning.model.dto.RegisterRequest;
import com.quitecodedevelopers.elearning.repository.UserRepository;
import com.quitecodedevelopers.elearning.security.JwtUtil;
import com.quitecodedevelopers.elearning.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User register(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail())!=null){
            throw new RuntimeException("Email Already Present");
        }
        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                "STUDENT"
        );
        return userRepository.save(user);
    }
    @Override

    public Map<String, Object> login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException ex) {
            throw new RuntimeException("Invalid credentials");
        }

        // User fetch
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Generate token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());


        // Password remove before sending
        user.setPassword(null);

        return Map.of(
                "token", token,
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole(),
                "id", user.getId()
        );
    }

}
