import type {RoomType} from "./RoomType.ts";
import type {RoomSectionModel} from "./RoomSectionModel.ts";

export type RoomModel = {
    roomType: RoomType;
    roomSections: RoomSectionModel[];
};