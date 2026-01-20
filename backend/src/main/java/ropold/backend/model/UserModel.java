package ropold.backend.model;

import java.util.List;

public record UserModel(
        String id,
        String username,
        String name,
        String avatarUrl,
        String githubUrl,
        List<String> favoriteRealEstates
) {
}
