package ropold.backend.model;

import java.util.List;

public record RoomModel(
        RoomType roomType,
        List<RoomSectionModel> roomSections
) {
}
