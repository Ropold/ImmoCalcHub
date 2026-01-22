package ropold.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.junit.jupiter.api.Assertions;
import ropold.backend.model.AppUser;
import ropold.backend.model.PriceType;
import ropold.backend.model.RealEstateModel;
import ropold.backend.model.UserRole;
import ropold.backend.repository.AppUserRepository;
import ropold.backend.repository.RealEstateRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AppUserControllerTest {

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
                PriceType.PURCHASE,
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
                PriceType.PURCHASE,
                List.of(),
                85.0,
                80.0,
                "user",
                LocalDate.of(2024, 2, 20),
                "http://example.com/apartment1.jpg"
        );

        RealEstateModel realEstateModel3 = new RealEstateModel(
                "3",
                "Penthouse",
                "Luxuriöses Penthouse",
                "Rheinufer 5, 50669 Köln",
                850000.0,
                PriceType.PURCHASE,
                List.of(),
                200.0,
                190.0,
                "anotherUser",
                LocalDate.of(2024, 3, 10),
                "http://example.com/penthouse.jpg"
        );

        realEstateRepository.saveAll(List.of(realEstateModel1, realEstateModel2, realEstateModel3));
    }

    @Test
    void testGetMe_withLoggedInUser_expectUsername() throws Exception {
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("user"));
    }

    @Test
    void testGetMe_withoutLogin_expectAnonymousUsername() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("anonymousUser"));
    }

    @Test
    void testGetUserDetails_withLoggedInUser_expectUserDetails() throws Exception {
        // Erstellen eines Mock OAuth2User
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getAttributes()).thenReturn(Map.of(
                "login", "username",
                "name", "max mustermann",
                "avatar_url", "https://github.com/avatar",
                "html_url", "https://github.com/mustermann"
        ));

        // Simuliere den OAuth2User in der SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/me/details"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                {
                    "login": "username",
                    "name": "max mustermann",
                    "avatar_url": "https://github.com/avatar",
                    "html_url": "https://github.com/mustermann"
                }
            """));
    }

    @Test
    void testGetUserDetails_withoutLogin_expectErrorMessage() throws Exception {
        mockMvc.perform(get("/api/users/me/details"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                {
                    "message": "User not authenticated"
                }
            """));
    }

    @Test
    void testGetUserRole_withLoggedInUser_expectRole() throws Exception {
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/me/role"))
                .andExpect(status().isOk())
                .andExpect(content().string("USER"));
    }

    @Test
    void testGetUserRole_withoutLogin_expectAnonymousUser() throws Exception {
        mockMvc.perform(get("/api/users/me/role"))
                .andExpect(status().isOk())
                .andExpect(content().string("anonymousUser"));
    }

    @Test
    void testGetUserFavorites_shouldReturnFavoriteRealEstates() throws Exception {
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/favorites"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("2"))
                .andExpect(jsonPath("$[0].title").value("Moderne Wohnung"));
    }

    @Test
    void testGetRealEstatesForGithubUser_shouldReturnUserRealEstates() throws Exception {
        mockMvc.perform(get("/api/users/me/my-real-estates/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Schönes Einfamilienhaus"))
                .andExpect(jsonPath("$[1].title").value("Moderne Wohnung"));
    }

    @Test
    void testAddRealEstateToFavorites_shouldAddFavorite() throws Exception {
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(post("/api/users/favorites/1"))
                .andExpect(status().isCreated());

        AppUser updatedUser = appUserRepository.findById("user").orElseThrow();
        Assertions.assertTrue(updatedUser.favoriteRealEstates().contains("1"));
        Assertions.assertEquals(2, updatedUser.favoriteRealEstates().size());
    }

    @Test
    void testRemoveRealEstateFromFavorites_shouldRemoveFavorite() throws Exception {
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(delete("/api/users/favorites/2"))
                .andExpect(status().isNoContent());

        AppUser updatedUser = appUserRepository.findById("user").orElseThrow();
        Assertions.assertFalse(updatedUser.favoriteRealEstates().contains("2"));
        Assertions.assertEquals(0, updatedUser.favoriteRealEstates().size());
    }

}
