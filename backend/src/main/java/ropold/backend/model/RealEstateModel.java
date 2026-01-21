package ropold.backend.model;

import java.time.LocalDate;
import java.util.List;

public record RealEstateModel(
        String id,
        String title,
        String description,
        String address,
        double price,
        List<RoomModel> rooms,
        double totalFloorArea,
        double totalLivingAreaWoFlV,
        String githubId,
        LocalDate createdAt,
        String imageUrl
) {
}