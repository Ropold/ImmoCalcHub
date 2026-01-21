import {RoomModel} from "./RoomModel.ts";

export type RealEstateModel = {
    id: string;
    title: string;
    description: string;
    address: string;
    price: number;
    rooms: RoomModel[];
    totalFloorArea: number;
    totalLivingAreaWoFlV: number;
    githubId: string;
    createdAt: string;
    imageUrl: string | null;
};