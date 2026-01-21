package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.AppUser;
import ropold.backend.model.RealEstateModel;
import ropold.backend.model.UserRole;
import ropold.backend.repository.AppUserRepository;
import ropold.backend.repository.RealEstateRepository;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RealEstateControllerTest {

    @MockBean
    private Cloudinary cloudinary;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private RealEstateRepository realEstateRepository;

    @BeforeEach
    void setUp() {
        appUserRepository.deleteAll();
        realEstateRepository.deleteAll();

        AppUser user = new AppUser(
                "user",
                "username",
                "Max Mustermann",
                "https://github.com/avatar",
                "https://github.com/mustermann",
                UserRole.USER,
                List.of("2")
        );
        appUserRepository.save(user);

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

        realEstateRepository.saveAll(List.of(realEstateModel1, realEstateModel2));
    }

    @Test
    void testGetAllRealEstates_shouldReturnAllRealEstates() throws Exception {
        mockMvc.perform(get("/api/immo-calc-hub"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Schönes Einfamilienhaus"))
                .andExpect(jsonPath("$[1].title").value("Moderne Wohnung"));
    }

    @Test
    void testGetRealEstateById_shouldReturnRealEstate() throws Exception {
        mockMvc.perform(get("/api/immo-calc-hub/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Schönes Einfamilienhaus"));
    }

    @Test
    void testPostRealEstate_shouldCreateRealEstate() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
        );
        realEstateRepository.deleteAll();

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.test.de/"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/immo-calc-hub")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("realEstateModel", "", "application/json", """
                        {
                          "title": "Luxusvilla",
                          "description": "Villa mit Pool",
                          "address": "Seestraße 5, 50670 Köln",
                          "price": 850000.0,
                          "rooms": [],
                          "totalFloorArea": 200.0,
                          "totalLivingAreaWoFlV": 190.0,
                          "githubId": "user",
                          "createdAt": "2024-03-01",
                          "imageUrl": "https://example.com/villa.jpg"
                        }
                    """.getBytes())))
                .andExpect(status().isCreated());

        List<RealEstateModel> allRealEstates = realEstateRepository.findAll();
        Assertions.assertEquals(1, allRealEstates.size());

        RealEstateModel savedRealEstate = allRealEstates.getFirst();
        org.assertj.core.api.Assertions.assertThat(savedRealEstate)
                .usingRecursiveComparison()
                .ignoringFields("id", "imageUrl", "createdAt")
                .isEqualTo(new RealEstateModel(
                        null,
                        "Luxusvilla",
                        "Villa mit Pool",
                        "Seestraße 5, 50670 Köln",
                        850000.0,
                        List.of(),
                        200.0,
                        190.0,
                        "user",
                        null,
                        null
                ));
    }

    @Test
    void updateRealEstateWithPut_shouldReturnUpdatedRealEstate() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/immo-calc-hub/1")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("realEstateModel", "", "application/json", """
                        {
                          "id": "1",
                          "title": "Renoviertes Einfamilienhaus",
                          "description": "Frisch renoviertes Haus",
                          "address": "Musterstraße 1, 50667 Köln",
                          "price": 480000.0,
                          "rooms": [],
                          "totalFloorArea": 125.0,
                          "totalLivingAreaWoFlV": 120.0,
                          "githubId": "user",
                          "createdAt": "2024-01-15",
                          "imageUrl": "https://example.com/updated-image.jpg"
                        }
                    """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Renoviertes Einfamilienhaus"))
                .andExpect(jsonPath("$.price").value(480000.0))
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/updated-image.jpg"));

        RealEstateModel updated = realEstateRepository.findById("1").orElseThrow();
        Assertions.assertEquals("Renoviertes Einfamilienhaus", updated.title());
        Assertions.assertEquals(480000.0, updated.price());
        Assertions.assertEquals("https://example.com/updated-image.jpg", updated.imageUrl());
    }

    @Test
    void deleteRealEstate_shouldReturnNoContent() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/immo-calc-hub/1"))
                .andExpect(status().isNoContent());
        Assertions.assertFalse(realEstateRepository.existsById("1"));
    }


    @Test
    void updateRealEstate_withoutImage_shouldSetImageUrlNull() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/immo-calc-hub/2")
                        .file(new MockMultipartFile("realEstateModel", "", "application/json", """
                        {
                          "id": "2",
                          "title": "Moderne Wohnung Updated",
                          "description": "Zentral gelegene Wohnung - renoviert",
                          "address": "Hauptstraße 10, 50668 Köln",
                          "price": 340000.0,
                          "rooms": [],
                          "totalFloorArea": 85.0,
                          "totalLivingAreaWoFlV": 80.0,
                          "githubId": "user",
                          "createdAt": "2024-02-20",
                          "imageUrl": null
                        }
                    """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imageUrl").value(Matchers.nullValue()));

        RealEstateModel updated = realEstateRepository.findById("2").orElseThrow();
        Assertions.assertNull(updated.imageUrl());
    }
}