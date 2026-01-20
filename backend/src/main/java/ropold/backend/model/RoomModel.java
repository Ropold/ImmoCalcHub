package ropold.backend.model;

import java.util.List;

public record RoomModel(
        String name,
        List<RoomSectionModel> roomSections
) {
}
