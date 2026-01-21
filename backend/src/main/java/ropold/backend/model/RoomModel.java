package ropold.backend.model;

import java.util.List;

public record RoomModel(
        String name,
        RoomType roomType,
        List<RoomSectionModel> roomSections
) {
}
