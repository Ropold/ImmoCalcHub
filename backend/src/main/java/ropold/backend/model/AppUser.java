package ropold.backend.model;

import java.util.List;

public record AppUser(
        String id,
        String username,
        String name,
        String avatarUrl,
        String githubUrl,
        UserRole role,
        List<String> favoriteRealEstates
) {
}
