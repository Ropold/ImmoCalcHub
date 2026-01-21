package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AppUserRepository;

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

}