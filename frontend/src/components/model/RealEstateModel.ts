import type {RoomModel} from "./RoomModel.ts";
import type {PriceType} from "./PriceType.ts";

export type RealEstateModel = {
    id: string;
    title: string;
    description: string;
    address: string;
    price: number;
    priceType: PriceType;
    rooms: RoomModel[];
    totalFloorArea: number;
    totalLivingAreaWoFlV: number;
    githubId: string;
    createdAt: string;
    imageUrl: string | null;
};