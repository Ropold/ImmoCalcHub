package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.RealEstateModel;
import ropold.backend.repository.RealEstateRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RealEstateService {

    private final IdService idService;
    private final RealEstateRepository realEstateRepository;
    private final CloudinaryService cloudinaryService;

    public List<RealEstateModel> getAllRealEstates() {
        return realEstateRepository.findAll();
    }
}
