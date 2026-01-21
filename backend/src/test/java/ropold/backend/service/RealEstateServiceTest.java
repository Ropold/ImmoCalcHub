package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.RealEstateModel;
import ropold.backend.repository.RealEstateRepository;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;

public class RealEstateServiceTest {

    IdService idService = mock(IdService.class);
    RealEstateRepository realEstateRepository = mock(RealEstateRepository.class);
    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    RealEstateService realEstateService = new RealEstateService(idService, realEstateRepository, cloudinaryService);

    List<RealEstateModel> realEstateModels;

    @BeforeEach
    void setup(){
        RealEstateModel realEstateModel1 = new RealEstateModel(
                "1",
                "Schönes Einfamilienhaus",
                "Tolles Haus mit Garten",
                "Musterstraße 1, 50667 Köln",
                450000.0,
                List.of(),
                120.5,
                115.0,
                "user",
                LocalDate.of(2024, 1, 15),
                "http://example.com/house1.jpg"
        );

        RealEstateModel realEstateModel2 = new RealEstateModel(
                "2",
                "Moderne Wohnung",
                "Zentral gelegene Wohnung",
                "Hauptstraße 10, 50668 Köln",
                320000.0,
                List.of(),
                85.0,
                80.0,
                "user",
                LocalDate.of(2024, 2, 20),
                "http://example.com/apartment1.jpg"
        );

        realEstateModels = List.of(realEstateModel1, realEstateModel2);
        when(realEstateRepository.findAll()).thenReturn(realEstateModels);
    }

    @Test
    void testGetAllRealEstates() {
        List<RealEstateModel> result = realEstateService.getAllRealEstates();
        assertEquals(realEstateModels, result);
    }

    @Test
    void testGetRealEstateById() {
        RealEstateModel expectedRealEstate = realEstateModels.getFirst();
        when(realEstateRepository.findById(expectedRealEstate.id())).thenReturn(java.util.Optional.of(expectedRealEstate));
        RealEstateModel result = realEstateService.getRealEstateById(expectedRealEstate.id());
        assertEquals(expectedRealEstate, result);
    }

    @Test
    void testAddRealEstate(){
        RealEstateModel realEstateModel3 = new RealEstateModel(
                null,
                "Luxusvilla",
                "Villa mit Pool",
                "Seestraße 5, 50670 Köln",
                850000.0,
                List.of(),
                200.0,
                190.0,
                "user",
                LocalDate.now(),
                "http://example.com/villa1.jpg"
        );

        when(idService.generateRandomId()).thenReturn("3");
        when(realEstateRepository.save(any(RealEstateModel.class))).thenReturn(realEstateModel3);

        RealEstateModel expected = realEstateService.addRealEstate(realEstateModel3);
        assertEquals(realEstateModel3, expected);
        verify(idService, times(1)).generateRandomId();
        verify(realEstateRepository).save(any(RealEstateModel.class));

    }

    @Test
    void testUpdateRealEstate(){
        RealEstateModel updatedRealEstate = new RealEstateModel(
                "1",
                "Schönes Einfamilienhaus",
                "Tolles Haus mit Garten - Renoviert",
                "Musterstraße 1, 50667 Köln",
                450000.0,
                List.of(),
                120.5,
                115.0,
                "user",
                LocalDate.of(2024, 1, 15),
                "http://example.com/updated_house1.jpg"
        );

        when(realEstateRepository.findById("1")).thenReturn(java.util.Optional.of(realEstateModels.getFirst()));
        when(idService.generateRandomId()).thenReturn("1");
        when(realEstateRepository.save(updatedRealEstate)).thenReturn(updatedRealEstate);

        RealEstateModel result = realEstateService.updateRealEstate(updatedRealEstate);
        assertEquals(updatedRealEstate, result);
        verify(realEstateRepository).save(updatedRealEstate);
    }

    @Test
    void testDeleteRealEstate(){
        RealEstateModel realEstateModel = realEstateModels.getFirst();
        when(realEstateRepository.findById(realEstateModel.id())).thenReturn(java.util.Optional.of(realEstateModel));
        realEstateService.deleteRealEstate("1");
        verify(realEstateRepository, times(1)).deleteById("1");
        verify(cloudinaryService, times(1)).deleteImage(realEstateModel.imageUrl());
    }

}