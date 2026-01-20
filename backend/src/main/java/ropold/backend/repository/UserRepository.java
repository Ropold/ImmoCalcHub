package ropold.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ropold.backend.model.UserModel;

public interface UserRepository extends MongoRepository<UserModel, String> {
}
