package com.quitecodedevelopers.elearning.repository;

import com.quitecodedevelopers.elearning.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
}
