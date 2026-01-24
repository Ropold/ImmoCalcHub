import type {RoomModel} from "./RoomModel.ts";
import type {PriceType} from "./PriceType.ts";

export type RealEstateModel = {
    id: string;
    realEstateTitle: string;
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

export const DefaultRealEstate: RealEstateModel = {
    id: "",
    realEstateTitle: "",
    description: "",
    address: "",
    price: 0,
    priceType: "PURCHASE",
    rooms: [],
    totalFloorArea: 0,
    totalLivingAreaWoFlV: 0,
    githubId: "",
    createdAt: "",
    imageUrl: null
};
