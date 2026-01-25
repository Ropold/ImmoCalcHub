import type {RoomModel} from "../model/RoomModel.ts";
import type {RoomSectionModel} from "../model/RoomSectionModel.ts";

export function addRoom(rooms: RoomModel[]): RoomModel[] {
    return [...rooms, {roomTitel: "", roomType: "LIVING_ROOM", roomSections: []}];
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
            {roomSectionTitel: "", length: 0, width: 0, height: 0}
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