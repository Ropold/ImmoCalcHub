package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AppUserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUser getUserById(String userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String getUserRole(String userId) {
        AppUser user = getUserById(userId);
        return user.role().name();
    }

    public List<String> getUserFavoriteRealEstates(String userId) {
        AppUser user = getUserById(userId);
        return user.favoriteRealEstates();
    }

    public void addRealEstateToFavoriteRealEstates(String userId, String realEstateId) {
        AppUser user = getUserById(userId);
        List<String> favoriteRealEstates = new ArrayList<>(user.favoriteRealEstates());

        if (!favoriteRealEstates.contains(realEstateId)) {
            favoriteRealEstates.add(realEstateId);
            AppUser updatedUser = new AppUser(
                    user.id(),
                    user.username(),
                    user.name(),
                    user.avatarUrl(),
                    user.githubUrl(),
                    user.preferredLanguage(),
                    user.role(),
                    favoriteRealEstates
            );
            appUserRepository.save(updatedUser);
        }
    }

    public void removeRealEstateFromFavoriteRealEstates(String userId, String realEstateId) {
        AppUser user = getUserById(userId);
        List<String> favoriteRealEstates = new ArrayList<>(user.favoriteRealEstates());

        favoriteRealEstates.remove(realEstateId);
        AppUser updatedUser = new AppUser(
                user.id(),
                user.username(),
                user.name(),
                user.avatarUrl(),
                user.githubUrl(),
                user.preferredLanguage(),
                user.role(),
                favoriteRealEstates
        );
        appUserRepository.save(updatedUser);
    }

    public void setPreferredLanguage(String userId, String languageIso) {
        AppUser user = getUserById(userId);
        AppUser updatedUser = new AppUser(
                user.id(),
                user.username(),
                user.name(),
                user.avatarUrl(),
                user.githubUrl(),
                languageIso,
                user.role(),
                user.favoriteRealEstates()
        );
        appUserRepository.save(updatedUser);
    }

}