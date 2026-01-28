package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import ropold.backend.model.RealEstateModel;
import ropold.backend.service.AppUserService;
import ropold.backend.service.RealEstateService;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AppUserService appUserService;
    private final RealEstateService realEstateService;

    @GetMapping(value = "/me", produces = "text/plain")
    public String getMe() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/me/details")
    public Map<String, Object> getUserDetails(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return Map.of("message", "User not authenticated");
        }
        return user.getAttributes();
    }

    @GetMapping("/me/role")
    public String getUserRole(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return "anonymousUser";
        }
        return appUserService.getUserRole(user.getName());
    }

    @GetMapping("/favorites")
    public List<RealEstateModel> getUserFavorites(@AuthenticationPrincipal OAuth2User authentication) {
        List<String> favoriteRealEstatesIds = appUserService.getUserFavoriteRealEstates(authentication.getName());
        return realEstateService.getRealEstatesByIds(favoriteRealEstatesIds);
    }

    @GetMapping("/me/my-real-estates/{githubId}")
    public List<RealEstateModel> getRealEstatesForGithubUser(@PathVariable String githubId) {
        return realEstateService.getRealEstatesForGithubUser(githubId);
    }

    @PostMapping("/favorites/{realEstateId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addRealEstateToFavorites(@PathVariable String realEstateId, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        appUserService.addRealEstateToFavoriteRealEstates(authenticatedUserId, realEstateId);
    }

    @DeleteMapping("/favorites/{realEstateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeRealEstateFromFavorites(@PathVariable String realEstateId, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        appUserService.removeRealEstateFromFavoriteRealEstates(authenticatedUserId, realEstateId);
    }

    @PostMapping("/me/language/{languageIso}")
    @ResponseStatus(HttpStatus.OK)
    public void setPreferredLanguage(@PathVariable String languageIso, @AuthenticationPrincipal OAuth2User authentication) {
        if (authentication == null) {
            throw new RuntimeException("User not authenticated");
        }
        appUserService.setPreferredLanguage(authentication.getName(), languageIso);
    }
}