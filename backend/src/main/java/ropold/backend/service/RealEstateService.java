package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.repository.RealEstateRepository;

@Service
@RequiredArgsConstructor
public class RealEstateService {

    private final IdService idService;
    private final RealEstateRepository realEstateRepository;
    private final CloudinaryService cloudinaryService;

}
