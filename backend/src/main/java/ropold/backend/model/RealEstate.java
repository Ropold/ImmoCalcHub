package ropold.backend.model;

import java.time.LocalDate;
import java.util.List;

public record RealEstate(
        String id,
        String title,
        String description,
        String address,
        double price,
        List<Room> rooms,
        String githubId,
        String createdBy,
        LocalDate createdAt,
        String imageUrl
) {
}
