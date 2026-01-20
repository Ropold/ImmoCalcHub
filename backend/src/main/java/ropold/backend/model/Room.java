package ropold.backend.model;

import java.util.List;

public record Room(
        String name,
        List<RoomSection> roomSections
) {
}
