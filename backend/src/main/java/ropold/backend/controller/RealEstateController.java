package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.exception.RealEstateNotFoundException;
import ropold.backend.model.RealEstateModel;
import ropold.backend.service.CloudinaryService;
import ropold.backend.service.RealEstateService;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/immo-calc-hub")
@RequiredArgsConstructor
public class RealEstateController {

    private final RealEstateService realEstateService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public List<RealEstateModel> getAllRealEstates() {
        return realEstateService.getAllRealEstates();
    }

    @GetMapping("/{id}")
    public RealEstateModel getRealEstateById(@PathVariable String id) {
        RealEstateModel realEstateModel = realEstateService.getRealEstateById(id);
        if (realEstateModel == null) {
            throw new RealEstateNotFoundException("No Real Estate found with id: " + id);
        }
        return realEstateModel;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public RealEstateModel addRealEstate(
            @RequestPart("realEstateModel") RealEstateModel realEstateModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        return realEstateService.addRealEstate(
                new RealEstateModel(
                        null,
                        realEstateModel.title(),
                        realEstateModel.description(),
                        realEstateModel.address(),
                        realEstateModel.price(),
                        realEstateModel.rooms(),
                        realEstateModel.totalFloorArea(),
                        realEstateModel.totalLivingAreaWoFlV(),
                        realEstateModel.githubId(),
                        LocalDate.now(),
                        imageUrl
                )
        );
    }

    @PutMapping("/{id}")
    public RealEstateModel updateRealEstate(
            @PathVariable String id,
            @RequestPart("realEstateModel") RealEstateModel realEstateModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();
        RealEstateModel existingRealEstate = realEstateService.getRealEstateById(id);

        if (!authenticatedUserId.equals(existingRealEstate.githubId())) {
            throw new AccessDeniedException("You do not have permission to update this real estate.");
        }

        String newImageUrl;

        if (image != null && !image.isEmpty()) {
            newImageUrl = cloudinaryService.uploadImage(image);
        } else if (realEstateModel.imageUrl() == null || realEstateModel.imageUrl().isBlank()) {
            newImageUrl = null;
        } else {
            newImageUrl = existingRealEstate.imageUrl();
        }

        RealEstateModel updatedRealEstate = new RealEstateModel(
                null,
                realEstateModel.title(),
                realEstateModel.description(),
                realEstateModel.address(),
                realEstateModel.price(),
                realEstateModel.rooms(),
                realEstateModel.totalFloorArea(),
                realEstateModel.totalLivingAreaWoFlV(),
                realEstateModel.githubId(),
                LocalDate.now(),
                newImageUrl
        );

        return realEstateService.updateRealEstate(updatedRealEstate);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRealEstate(@PathVariable String id, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        RealEstateModel realEstateModel = realEstateService.getRealEstateById(id);

        if (!authenticatedUserId.equals(realEstateModel.githubId())) {
            throw new AccessDeniedException("You do not have permission to delete this real estate.");
        }
        realEstateService.deleteRealEstate(id);
    }

}