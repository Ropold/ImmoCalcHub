package ropold.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ropold.backend.model.RealEstateModel;

public interface RealEstateRepository extends MongoRepository<RealEstateModel, String> {
}
