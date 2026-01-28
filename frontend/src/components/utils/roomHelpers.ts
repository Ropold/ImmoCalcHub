import type {RoomModel} from "../model/RoomModel.ts";
import type {RoomSectionModel} from "../model/RoomSectionModel.ts";
import type {RoomType} from "../model/RoomType.ts";

export type AreaCalculation = {
    totalFloorArea: number;
    totalLivingAreaWoFlV: number;
};

// Raumtypen die 0% zur Wohnfläche zählen
const ZERO_PERCENT_ROOMS: RoomType[] = ["BASEMENT", "STORAGE"];

// Raumtypen die 25% zur Wohnfläche zählen (Balkon, Terrasse)
const QUARTER_PERCENT_ROOMS: RoomType[] = ["BALCONY", "TERRACE"];

/**
 * Berechnet Grundfläche und Wohnfläche nach WoFlV aus den Räumen.
 * WoFlV-Regeln:
 * - BASEMENT, STORAGE: 0%
 * - BALCONY, TERRACE: 25%
 * - Alle anderen Räume nach Höhe:
 *   - Höhe >= 2m: 100%
 *   - Höhe >= 1m und < 2m: 50%
 *   - Höhe < 1m: 0%
 */
export function calculateAreas(rooms: RoomModel[]): AreaCalculation {
    let totalFloorArea = 0;
    let totalLivingAreaWoFlV = 0;

    for (const room of rooms) {
        for (const section of room.roomSections) {
            const sectionArea = section.length * section.width;
            totalFloorArea += sectionArea;

            // WoFlV-Berechnung basierend auf Raumtyp
            if (ZERO_PERCENT_ROOMS.includes(room.roomType)) {
                // Keller, Abstellraum: 0%
            } else if (QUARTER_PERCENT_ROOMS.includes(room.roomType)) {
                // Balkon, Terrasse: 25%
                totalLivingAreaWoFlV += sectionArea * 0.25;
            } else {
                // Normale Wohnräume: nach Höhe
                if (section.height >= 2) {
                    totalLivingAreaWoFlV += sectionArea;
                } else if (section.height >= 1) {
                    totalLivingAreaWoFlV += sectionArea * 0.5;
                }
                // Höhe < 1m: 0%
            }
        }
    }

    return {
        totalFloorArea: Math.round(totalFloorArea * 100) / 100,
        totalLivingAreaWoFlV: Math.round(totalLivingAreaWoFlV * 100) / 100,
    };
}

export function addRoom(rooms: RoomModel[]): RoomModel[] {
    return [...rooms, {roomTitel: "", roomType: "LIVING_ROOM", roomSections: [{roomSectionTitel: "", length: 0, width: 0, height: 2.5}]}];
}

export function updateRoom(rooms: RoomModel[], index: number, field: keyof RoomModel, value: string | RoomSectionModel[]): RoomModel[] {
    const updatedRooms = [...rooms];
    updatedRooms[index] = {...updatedRooms[index], [field]: value};
    return updatedRooms;
}

export function removeRoom(rooms: RoomModel[], index: number): RoomModel[] {
    return rooms.filter((_, i) => i !== index);
}

export function addRoomSection(rooms: RoomModel[], roomIndex: number): RoomModel[] {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        roomSections: [
            ...updatedRooms[roomIndex].roomSections,
            {roomSectionTitel: "", length: 0, width: 0, height: 2.5}
        ]
    };
    return updatedRooms;
}

export function removeRoomSection(rooms: RoomModel[], roomIndex: number, sectionIndex: number): RoomModel[] {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        roomSections: updatedRooms[roomIndex].roomSections.filter((_, i) => i !== sectionIndex)
    };
    return updatedRooms;
}

export function updateRoomSection(rooms: RoomModel[], roomIndex: number, sectionIndex: number, field: keyof RoomSectionModel, value: string | number): RoomModel[] {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        roomSections: updatedRooms[roomIndex].roomSections.map((section, i) =>
            i === sectionIndex ? {...section, [field]: value} : section
        )
    };
    return updatedRooms;
}