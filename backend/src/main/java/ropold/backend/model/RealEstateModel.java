package ropold.backend.model;

import java.time.LocalDate;
import java.util.List;

public record RealEstateModel(
        String id,
        String realEstateTitle,
        String description,
        String address,
        double price,
        PriceType priceType,
        List<RoomModel> rooms,
        double totalFloorArea,
        double totalLivingAreaWoFlV,
        String githubId,
        LocalDate createdAt,
        String imageUrl
) {
}