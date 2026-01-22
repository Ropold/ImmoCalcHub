package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.exception.RealEstateNotFoundException;
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

    public RealEstateModel getRealEstateById(String id) {
        return realEstateRepository.findById(id)
                .orElseThrow(() -> new RealEstateNotFoundException("No Real Estate found with id: " + id));
    }

    public RealEstateModel addRealEstate(RealEstateModel realEstateModel) {
        RealEstateModel newRealEstateModel = new RealEstateModel(
                idService.generateRandomId(),
                realEstateModel.title(),
                realEstateModel.description(),
                realEstateModel.address(),
                realEstateModel.price(),
                realEstateModel.priceType(),
                realEstateModel.rooms(),
                realEstateModel.totalFloorArea(),
                realEstateModel.totalLivingAreaWoFlV(),
                realEstateModel.githubId(),
                realEstateModel.createdAt(),
                realEstateModel.imageUrl()
        );
        return realEstateRepository.save(newRealEstateModel);
    }

    public RealEstateModel updateRealEstate(RealEstateModel realEstateModel) {
        RealEstateModel existingRealEstate = getRealEstateById(realEstateModel.id());

        boolean oldHadImage = existingRealEstate.imageUrl() != null && !existingRealEstate.imageUrl().isBlank();
        boolean nowNoImage = realEstateModel.imageUrl() == null || realEstateModel.imageUrl().isBlank();
        boolean imageWasReplaced = oldHadImage && !existingRealEstate.imageUrl().equals(realEstateModel.imageUrl());

        if (oldHadImage && (nowNoImage || imageWasReplaced)) {
            cloudinaryService.deleteImage(existingRealEstate.imageUrl());
        }

        return realEstateRepository.save(realEstateModel);
    }

    public void deleteRealEstate(String id) {
        RealEstateModel realEstateModel = realEstateRepository.findById(id)
                .orElseThrow(() -> new RealEstateNotFoundException("No Real Estate found with id: " + id));

        if(realEstateModel.imageUrl() != null) {
            cloudinaryService.deleteImage(realEstateModel.imageUrl());
        }
        realEstateRepository.deleteById(id);
    }

    public List<RealEstateModel> getRealEstatesByIds(List<String> ids) {
        return ids.stream()
                .map(this::getRealEstateById)
                .toList();
    }

    public List<RealEstateModel> getRealEstatesForGithubUser(String githubId) {
        return realEstateRepository.findAll().stream()
                .filter(realEstate -> realEstate.githubId().equals(githubId))
                .toList();
    }
}