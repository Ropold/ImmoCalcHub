import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import type {RealEstateModel} from "./model/RealEstateModel.ts";
import {type PriceType, PRICE_TYPES} from "./model/PriceType.ts";
import type {RoomModel} from "./model/RoomModel.ts";
import {type RoomType, ROOM_TYPES} from "./model/RoomType.ts";
import * as roomHelpers from "./utils/roomHelpers.ts";
import "./styles/AddRealEstateCard.css"

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
    const [rooms, setRooms] = useState<RoomModel[]>([{roomTitel: "", roomType: "LIVING_ROOM", roomSections: [{roomSectionTitel: "", length: 0, width: 0, height: 2.5}]}]);
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
        <>
            <h2>Add Real Estate</h2>
            <form onSubmit={handleSubmit}>
                <div className="edit-form">
                    <label className="add-real-estate-label">
                        Title:
                        <input
                            className="input-small"
                            type="text"
                            value={realEstateTitle}
                            onChange={(e) => setRealEstateTitle(e.target.value)}
                        />
                    </label>
                    <label className="add-real-estate-label">
                        Description:
                        <input
                            className="input-small"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label className="add-real-estate-label">
                        Address:
                        <input
                            className="input-small"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    <label className="add-real-estate-label">
                        Price:
                        <input
                            className="input-small"
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </label>
                    <label className="add-real-estate-label">
                        Price Type:
                        <select
                            className="input-small"
                            value={priceType ?? ""}
                            onChange={(e) => setPriceType(e.target.value as PriceType)}
                        >
                            <option value="" disabled>-- Bitte wählen --</option>
                            {PRICE_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </label>
                    <label className="add-real-estate-label">
                        Total Floor Area (m²):
                        <input
                            className="input-small"
                            type="text"
                            value={totalFloorArea}
                            onChange={(e) => setTotalFloorArea(Number(e.target.value))}
                        />
                    </label>
                    <label className="add-real-estate-label">
                        Living Area (m²):
                        <input
                            className="input-small"
                            type="text"
                            value={totalLivingAreaWoFlV}
                            onChange={(e) => setTotalLivingAreaWoFlV(Number(e.target.value))}
                        />
                    </label>
                </div>

                {/* Rooms Section (optional) */}
                <div className="margin-top-20">
                    <h3>Rooms</h3>
                    <button
                        type="button"
                        className="blue-button"
                        onClick={() => setRooms(roomHelpers.addRoom(rooms))}
                    >
                        Add Room
                    </button>

                    {rooms.map((room, roomIndex) => (
                        <div key={roomIndex} className="edit-form margin-top-20">
                            <label className="add-real-estate-label">
                                Room Title:
                                <input
                                    className="input-small"
                                    type="text"
                                    value={room.roomTitel}
                                    onChange={(e) => setRooms(roomHelpers.updateRoom(rooms, roomIndex, "roomTitel", e.target.value))}
                                />
                            </label>
                            <label className="add-real-estate-label">
                                Room Type:
                                <select
                                    className="input-small"
                                    value={room.roomType}
                                    onChange={(e) => setRooms(roomHelpers.updateRoom(rooms, roomIndex, "roomType", e.target.value as RoomType))}
                                >
                                    {ROOM_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </label>
                            <button
                                type="button"
                                id="room-section-button"
                                className="red-button"
                                onClick={() => setRooms(roomHelpers.removeRoom(rooms, roomIndex))}
                            >
                                Remove Room
                            </button>
                            <button
                                type="button"
                                id="room-section-button"
                                className="green-button"
                                onClick={() => setRooms(roomHelpers.addRoomSection(rooms, roomIndex))}
                            >
                                Add new Section
                            </button>

                            {/* Sections */}
                            <div style={{gridColumn: "1 / -1"}}>

                                {room.roomSections.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="edit-form margin-top-20">
                                        <label className="add-real-estate-label">
                                            Section Title:
                                            <input
                                                className="input-small"
                                                type="text"
                                                value={section.roomSectionTitel}
                                                onChange={(e) => setRooms(roomHelpers.updateRoomSection(rooms, roomIndex, sectionIndex, "roomSectionTitel", e.target.value))}
                                            />
                                        </label>
                                        <label className="add-real-estate-label">
                                            Length (m):
                                            <input
                                                className="input-small"
                                                type="text"
                                                value={section.length}
                                                onChange={(e) => setRooms(roomHelpers.updateRoomSection(rooms, roomIndex, sectionIndex, "length", Number(e.target.value)))}
                                            />
                                        </label>
                                        <label className="add-real-estate-label">
                                            Width (m):
                                            <input
                                                className="input-small"
                                                type="text"
                                                value={section.width}
                                                onChange={(e) => setRooms(roomHelpers.updateRoomSection(rooms, roomIndex, sectionIndex, "width", Number(e.target.value)))}
                                            />
                                        </label>
                                        <label className="add-real-estate-label">
                                            Height (m):
                                            <input
                                                className="input-small"
                                                type="number"
                                                min="1"
                                                max="4"
                                                step="0.5"
                                                value={section.height}
                                                onChange={(e) => setRooms(roomHelpers.updateRoomSection(rooms, roomIndex, sectionIndex, "height", Number(e.target.value)))}
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            className="red-button"
                                            id="room-section-button"
                                            onClick={() => setRooms(roomHelpers.removeRoomSection(rooms, roomIndex, sectionIndex))}
                                        >
                                            Remove Section
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="margin-top-50">
                    <label>
                        Image:
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

                <button className="blue-button margin-top-50" type="submit">Save Real Estate</button>

            </form>
        </>
    );
}