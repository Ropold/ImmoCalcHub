package ropold.backend.model;

import java.util.List;

public record RoomModel(
        String roomTitel,
        RoomType roomType,
        List<RoomSectionModel> roomSections
) {
}
