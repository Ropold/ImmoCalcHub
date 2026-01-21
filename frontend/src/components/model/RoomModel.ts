import {RoomType} from "./RoomType.ts";
import {RoomSectionModel} from "./RoomSectionModel.ts";

export type RoomModel = {
    name: string;
    roomType: RoomType;
    roomSections: RoomSectionModel[];
};