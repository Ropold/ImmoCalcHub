package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ropold.backend.service.CloudinaryService;
import ropold.backend.service.RealEstateService;

@RestController
@RequestMapping("/api/immo-calc-hub")
@RequiredArgsConstructor
public class RealEstateController {

    private final RealEstateService realEstateService;
    private final CloudinaryService cloudinaryService;


}
