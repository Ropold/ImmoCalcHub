import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import type {RealEstateModel} from "./model/RealEstateModel.ts";
import {type PriceType, PRICE_TYPES, translatedPriceType} from "./model/PriceType.ts";
import type {RoomModel} from "./model/RoomModel.ts";
import {type RoomType, ROOM_TYPES, translatedRoomType, ROOM_TYPES_WITHOUT_HEIGHT} from "./model/RoomType.ts";
import * as roomHelpers from "./utils/roomHelpers.ts";
import {calculateAreas} from "./utils/roomHelpers.ts";
import "./styles/AddRealEstateCard.css"
import {translatedInfo} from "./utils/TranslatedInfo.ts";

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
    const [rooms, setRooms] = useState<RoomModel[]>([{roomType: "LIVING_ROOM", roomSections: [{roomSectionTitel: "", length: 0, width: 0, height: 2.5}]}]);
    const [totalFloorArea, setTotalFloorArea] = useState<number>(0);
    const [totalLivingAreaWoFlV, setTotalLivingAreaWoFlV] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

    // Automatische Berechnung der Flächen bei Änderung der Räume
    useEffect(() => {
        const { totalFloorArea: floorArea, totalLivingAreaWoFlV: livingArea } = calculateAreas(rooms);
        setTotalFloorArea(floorArea);
        setTotalLivingAreaWoFlV(livingArea);
    }, [rooms]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!priceType) {
            alert(translatedInfo["Please select PriceType"][props.language]);
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
                alert(translatedInfo["An unexpected error occurred. Please try again."][props.language]);
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
        <>
            <h2>{translatedInfo["Add Real Estate"][props.language]}</h2>
            <form onSubmit={handleSubmit}>
                <div className="edit-form">
                    <label className="add-real-estate-label">
                        {translatedInfo["Title"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={realEstateTitle}
                            onChange={(e) => setRealEstateTitle(e.target.value)}
                        />
                    </label>
                    <label className="add-real-estate-label">
                        {translatedInfo["Description"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label className="add-real-estate-label">
                        {translatedInfo["Address"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    <label className="add-real-estate-label">
                        {translatedInfo["Price"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </label>
                    <label className="add-real-estate-label">
                        {translatedInfo["Price Type"][props.language]}:
                        <select
                            className="input-small"
                            value={priceType ?? ""}
                            onChange={(e) => setPriceType(e.target.value as PriceType)}
                        >
                            <option value="" disabled>{translatedInfo["-- Please select --"][props.language]}</option>
                            {PRICE_TYPES.map((type) => (
                                <option key={type} value={type}>{translatedPriceType[type][props.language]}</option>
                            ))}
                        </select>
                    </label>
                    <label className="add-real-estate-label">
                        {translatedInfo["Total Floor Area (m²)"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={totalFloorArea}
                            readOnly
                        />
                    </label>
                    <label className="add-real-estate-label">
                        {translatedInfo["Living Area WoFlV (m²)"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={totalLivingAreaWoFlV}
                            readOnly
                        />
                    </label>
                </div>

                {/* Rooms Section (optional) */}
                <div className="margin-top-20">
                    <h3>{translatedInfo["Rooms"][props.language]}</h3>
                    <button
                        type="button"
                        className="blue-button"
                        onClick={() => setRooms(roomHelpers.addRoom(rooms))}
                    >
                        {translatedInfo["Add Room"][props.language]}
                    </button>

                    {rooms.map((room, roomIndex) => (
                        <div key={roomIndex} className="edit-form margin-top-20">
                            <label className="add-real-estate-label">
                                {translatedInfo["Room Type"][props.language]}:
                                <select
                                    className="input-small"
                                    value={room.roomType}
                                    onChange={(e) => setRooms(roomHelpers.updateRoom(rooms, roomIndex, "roomType", e.target.value as RoomType))}
                                >
                                    {ROOM_TYPES.map((type) => (
                                        <option key={type} value={type}>{translatedRoomType[type][props.language]}</option>
                                    ))}
                                </select>
                            </label>
                            <button
                                type="button"
                                id="room-section-button"
                                className="red-button"
                                onClick={() => setRooms(roomHelpers.removeRoom(rooms, roomIndex))}
                            >
                                {translatedInfo["Remove Room"][props.language]}
                            </button>
                            <button
                                type="button"
                                id="room-section-button"
                                className="green-button"
                                onClick={() => setRooms(roomHelpers.addRoomSection(rooms, roomIndex))}
                            >
                                {translatedInfo["Add New Section"][props.language]}
                            </button>

                            {/* Sections */}
                            <div style={{gridColumn: "1 / -1"}}>

                                {room.roomSections.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="edit-form margin-top-20">
                                        <label className="add-real-estate-label">
                                            {translatedInfo["Section Title"][props.language]}:
                                            <input
                                                className="input-small"
                                                type="text"
                                                value={section.roomSectionTitel}
                                                onChange={(e) => setRooms(roomHelpers.updateRoomSection(rooms, roomIndex, sectionIndex, "roomSectionTitel", e.target.value))}
                                            />
                                        </label>
                                        <label className="add-real-estate-label">
                                            {translatedInfo["Length (m)"][props.language]}:
                                            <input
                                                className="input-small"
                                                type="text"
                                                value={section.length}
                                                onChange={(e) => setRooms(roomHelpers.updateRoomSection(rooms, roomIndex, sectionIndex, "length", Number(e.target.value)))}
                                            />
                                        </label>
                                        <label className="add-real-estate-label">
                                            {translatedInfo["Width (m)"][props.language]}:
                                            <input
                                                className="input-small"
                                                type="text"
                                                value={section.width}
                                                onChange={(e) => setRooms(roomHelpers.updateRoomSection(rooms, roomIndex, sectionIndex, "width", Number(e.target.value)))}
                                            />
                                        </label>
                                        {!ROOM_TYPES_WITHOUT_HEIGHT.includes(room.roomType) && (
                                            <label className="add-real-estate-label">
                                                {translatedInfo["Height (m)"][props.language]}:
                                                <input
                                                    className="input-small"
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    step="any"
                                                    value={section.height}
                                                    onChange={(e) => setRooms(roomHelpers.updateRoomSection(rooms, roomIndex, sectionIndex, "height", Number(e.target.value)))}
                                                />
                                            </label>
                                        )}
                                        <button
                                            type="button"
                                            className="red-button"
                                            id="room-section-button"
                                            onClick={() => setRooms(roomHelpers.removeRoomSection(rooms, roomIndex, sectionIndex))}
                                        >
                                            {translatedInfo["Remove Section"][props.language]}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="margin-top-50">
                    <label>
                        {translatedInfo["Image"][props.language]}:
                        <input type="file" onChange={onFileChange}/>
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt={"image-preview"}
                                className="image-preview"
                            />
                        )}
                    </label>
                </div>

                <button className="blue-button margin-top-50" type="submit">{translatedInfo["Save Real Estate"][props.language]}</button>

            </form>
        </>
    );
}