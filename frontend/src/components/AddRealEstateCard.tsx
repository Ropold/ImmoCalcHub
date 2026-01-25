import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import type {RealEstateModel} from "./model/RealEstateModel.ts";
import {type PriceType, PRICE_TYPES} from "./model/PriceType.ts";
import type {RoomModel} from "./model/RoomModel.ts";
import {ROOM_TYPES} from "./model/RoomType.ts";
import * as roomHelpers from "./utils/roomHelpers.ts";

type AddRealEstateCardProps = {
    user:string;
    handleNewRealEstateSubmit: (newRealEstate: RealEstateModel) => void;
    language:string;
}

export default function AddRealEstateCard(props: Readonly<AddRealEstateCardProps>) {

    const [realEstateTitle, setRealEstateTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [priceType, setPriceType] = useState<PriceType | null>(null);
    const [rooms, setRooms] = useState<RoomModel[]>([]);
    const [totalFloorArea, setTotalFloorArea] = useState<number>(0);
    const [totalLivingAreaWoFlV, setTotalLivingAreaWoFlV] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!priceType) {
            alert("Bitte PriceType wählen");
            return;
        }

        const realEstateData = {
            realEstateTitle,
            description,
            address,
            price,
            priceType,
            rooms,
            totalFloorArea,
            totalLivingAreaWoFlV,
        };

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        data.append("realEstateModel", new Blob(
            [JSON.stringify(realEstateData)],
            {type: "application/json"}
        ));

        axios
            .post("/api/immo-calc-hub", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.handleNewRealEstateSubmit(response.data);
                navigate(`/real-estate/${response.data.id}`);
            })
            .catch((error) => {
                alert("An unexpected error occurred. Please try again.");
                console.error(error);
            });
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            setImage(file);
        }
    }

    return (
        <h2>
            Add Real Estate Card Component Placeholder
        </h2>
    );
}