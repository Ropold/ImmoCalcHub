import type {RealEstateModel} from "./model/RealEstateModel.ts";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {PRICE_TYPES, type PriceType, translatedPriceType} from "./model/PriceType.ts";
import {type RoomType, ROOM_TYPES, translatedRoomType, ROOM_TYPES_WITHOUT_HEIGHT} from "./model/RoomType.ts";
import * as roomHelpers from "./utils/roomHelpers.ts";
import {calculateAreas} from "./utils/roomHelpers.ts";
import RealEstateCard from "./RealEstateCard.tsx";
import Searchbar from "./Searchbar.tsx";
import "./styles/AddRealEstateCard.css";
import {translatedInfo} from "./utils/TranslatedInfo.ts";

type MyRealEstatesProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (realEstateId: string) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    handleUpdateRealEstate: (updatedRealEstate: RealEstateModel) => void;
    handleDeleteRealEstate: (realEstateId: string) => void;
    language: string;
}

export default function MyRealEstates(props: Readonly<MyRealEstatesProps>) {
    const [userRealEstates, setUserRealEstates] = useState<RealEstateModel[]>([]);
    const [editData, setEditData] = useState<RealEstateModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [realEstateToDelete, setRealEstateToDelete] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);
    const [imageDeleted, setImageDeleted] = useState(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredRealEstate, setFilteredRealEstate] = useState<RealEstateModel[]>([]);

    const location = useLocation();

    function filterRealEstates(realEstates: RealEstateModel[], query: string): RealEstateModel[] {
        const lowerQuery = query.toLowerCase();
        return realEstates.filter(realEstate =>
            realEstate.realEstateTitle.toLowerCase().includes(lowerQuery) ||
            realEstate.address.toLowerCase().includes(lowerQuery)
        );
    }

    useEffect(() => {
        setFilteredRealEstate(filterRealEstates(userRealEstates, searchQuery));
    }, [userRealEstates, searchQuery]);

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    // Automatische Berechnung der Flächen bei Änderung der Räume
    useEffect(() => {
        if (editData) {
            const { totalFloorArea, totalLivingAreaWoFlV } = calculateAreas(editData.rooms);
            if (editData.totalFloorArea !== totalFloorArea || editData.totalLivingAreaWoFlV !== totalLivingAreaWoFlV) {
                setEditData(prev => prev ? { ...prev, totalFloorArea, totalLivingAreaWoFlV } : null);
            }
        }
    }, [editData?.rooms]);



    function getUserRealEstates() {
        axios.get(`/api/users/me/my-real-estates/${props.user}`)
            .then((response) => {
                setUserRealEstates(response.data as RealEstateModel[]);
            })
            .catch((error) => {
                console.error("Error fetching real estates:", error);
            });
    }
    useEffect(() => {
        getUserRealEstates();
    }, []);

    function handleEditToggle(realEstateId: string) {
        const realEstateToEdit = userRealEstates.find(realEstate => realEstate.id === realEstateId);
        if (realEstateToEdit) {
            setEditData(realEstateToEdit);
            props.setIsEditing(true);

            if (realEstateToEdit.imageUrl) {
                fetch(realEstateToEdit.imageUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const file = new File([blob], "current-image.jpg", { type: blob.type });
                        setImage(file);
                    })
                    .catch((error) => console.error("Error loading current image:", error));
            }
        }
    }

    function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editData) return;

        let updatedImageUrl = editData.imageUrl;
        if (imageChanged) {
            if (image) {
                updatedImageUrl = "temp-image";
            } else if (imageDeleted) {
                updatedImageUrl = ""; // oder ggf. null, je nach Backend-API
            }
        }

        const updatedRealEstateData = {
            ...editData,
            imageUrl: updatedImageUrl,
        };

        const data = new FormData();
        if (imageChanged && image) {
            data.append("image", image);
        }
        data.append(
            "realEstateModel",
            new Blob([JSON.stringify(updatedRealEstateData)], { type: "application/json" })
        );

        axios
            .put(`/api/immo-calc-hub/${editData.id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                props.handleUpdateRealEstate(response.data);
                setUserRealEstates((prev) =>
                    prev.map((c) => (c.id === response.data.id ? response.data : c))
                );
                props.setIsEditing(false);
                setImageDeleted(false);
            })
            .catch((error) => {
                console.error("Error saving Real Estate edits:", error);
                alert(translatedInfo["An unexpected error occurred. Please try again."][props.language]);
            });
    }

    function onFileChange (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setImage(e.target.files[0]);
            setImageChanged(true);
        }
    }

    function handleDeleteClick(id: string) {
        setRealEstateToDelete(id);
        setShowPopup(true);
    }

    function handleCancel(){
        setRealEstateToDelete(null);
        setShowPopup(false);
    }

    function handleConfirmDelete() {
        if (realEstateToDelete) {
            axios
                .delete(`/api/immo-calc-hub/${realEstateToDelete}`)
                .then(() => {
                    props.handleDeleteRealEstate(realEstateToDelete);
                    setUserRealEstates((prev) =>
                        prev.filter((realEstate) => realEstate.id !== realEstateToDelete)
                    );
                })
                .catch((error) => {
                    console.error("Error deleting real estate:", error);
                    alert(translatedInfo["An unexpected error occurred. Please try again."][props.language]);
                })
                .finally(() => {
                    setRealEstateToDelete(null);
                    setShowPopup(false);
                });
        }
    }



    return (
        <div>
            {props.isEditing ? (
                <div>
                    <h2>{translatedInfo["Edit Real Estate"][props.language]}</h2>
                    <form onSubmit={handleSaveEdit}>
                        <div className="edit-form">
                            <label className="add-real-estate-label">
                                {translatedInfo["Title"][props.language]}:
                                <input
                                    className="input-small"
                                    type="text"
                                    value={editData?.realEstateTitle ?? ""}
                                    onChange={(e) => setEditData({...editData!, realEstateTitle: e.target.value})}
                                />
                            </label>
                            <label className="add-real-estate-label">
                                {translatedInfo["Description"][props.language]}:
                                <input
                                    className="input-small"
                                    type="text"
                                    value={editData?.description ?? ""}
                                    onChange={(e) => setEditData({...editData!, description: e.target.value})}
                                />
                            </label>
                            <label className="add-real-estate-label">
                                {translatedInfo["Address"][props.language]}:
                                <input
                                    className="input-small"
                                    type="text"
                                    value={editData?.address ?? ""}
                                    onChange={(e) => setEditData({...editData!, address: e.target.value})}
                                />
                            </label>
                            <label className="add-real-estate-label">
                                {translatedInfo["Price"][props.language]}:
                                <input
                                    className="input-small"
                                    type="number"
                                    value={editData?.price ?? 0}
                                    onChange={(e) => setEditData({...editData!, price: parseFloat(e.target.value)})}
                                />
                            </label>
                            <label className="add-real-estate-label">
                                {translatedInfo["Price Type"][props.language]}:
                                <select
                                    className="input-small"
                                    value={editData?.priceType ?? ""}
                                    onChange={(e) => setEditData({...editData!, priceType: e.target.value as PriceType})}
                                >
                                    <option value="" disabled>{translatedInfo["-- Please select --"][props.language]}</option>
                                    {PRICE_TYPES.map((type) => (
                                        <option key={type} value={type}>{translatedPriceType[type][props.language]}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="add-real-estate-label">
                                {translatedInfo["Total Floor Area"][props.language]}:
                                <input
                                    className="input-small"
                                    type="text"
                                    value={editData?.totalFloorArea ?? 0}
                                    readOnly
                                />
                            </label>
                            <label className="add-real-estate-label">
                                {translatedInfo["Living Area WoFlV"][props.language]}:
                                <input
                                    className="input-small"
                                    type="text"
                                    value={editData?.totalLivingAreaWoFlV ?? 0}
                                    readOnly
                                />
                            </label>
                        </div>

                        {/* Rooms Section */}
                        <div className="margin-top-20">
                            <h3>{translatedInfo["Rooms"][props.language]}</h3>
                            <button
                                type="button"
                                className="blue-button"
                                onClick={() => setEditData({...editData!, rooms: roomHelpers.addRoom(editData?.rooms ?? [])})}
                            >
                                {translatedInfo["Add Room"][props.language]}
                            </button>

                            {editData?.rooms.map((room, roomIndex) => (
                                <div key={roomIndex} className="edit-form margin-top-20">
                                    <label className="add-real-estate-label">
                                        {translatedInfo["Room Type"][props.language]}:
                                        <select
                                            className="input-small"
                                            value={room.roomType}
                                            onChange={(e) => setEditData({...editData!, rooms: roomHelpers.updateRoom(editData!.rooms, roomIndex, "roomType", e.target.value as RoomType)})}
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
                                        onClick={() => setEditData({...editData!, rooms: roomHelpers.removeRoom(editData!.rooms, roomIndex)})}
                                    >
                                        {translatedInfo["Remove Room"][props.language]}
                                    </button>
                                    <button
                                        type="button"
                                        id="room-section-button"
                                        className="green-button"
                                        onClick={() => setEditData({...editData!, rooms: roomHelpers.addRoomSection(editData!.rooms, roomIndex)})}
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
                                                        onChange={(e) => setEditData({...editData!, rooms: roomHelpers.updateRoomSection(editData!.rooms, roomIndex, sectionIndex, "roomSectionTitel", e.target.value)})}
                                                    />
                                                </label>
                                                <label className="add-real-estate-label">
                                                    {translatedInfo["Length (m)"][props.language]}:
                                                    <input
                                                        className="input-small"
                                                        type="text"
                                                        value={section.length}
                                                        onChange={(e) => setEditData({...editData!, rooms: roomHelpers.updateRoomSection(editData!.rooms, roomIndex, sectionIndex, "length", Number(e.target.value))})}
                                                    />
                                                </label>
                                                <label className="add-real-estate-label">
                                                    {translatedInfo["Width (m)"][props.language]}:
                                                    <input
                                                        className="input-small"
                                                        type="text"
                                                        value={section.width}
                                                        onChange={(e) => setEditData({...editData!, rooms: roomHelpers.updateRoomSection(editData!.rooms, roomIndex, sectionIndex, "width", Number(e.target.value))})}
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
                                                            onChange={(e) => setEditData({...editData!, rooms: roomHelpers.updateRoomSection(editData!.rooms, roomIndex, sectionIndex, "height", Number(e.target.value))})}
                                                        />
                                                    </label>
                                                )}
                                                <button
                                                    type="button"
                                                    className="red-button"
                                                    id="room-section-button"
                                                    onClick={() => setEditData({...editData!, rooms: roomHelpers.removeRoomSection(editData!.rooms, roomIndex, sectionIndex)})}
                                                >
                                                    {translatedInfo["Remove Section"][props.language]}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="margin-top-20">
                            <label>
                                {translatedInfo["Image"][props.language]}:
                                <input type="file" onChange={onFileChange}/>
                                {image && (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={editData?.realEstateTitle ?? "Preview"}
                                        className="image-preview"
                                    />
                                )}
                            </label>
                            <button className="blue-button" type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setImageChanged(true);
                                        setImageDeleted(true);
                                    }}>{translatedInfo["Remove Image"][props.language]}
                            </button>
                        </div>

                        <div className="space-between margin-top-20">
                            <button className="blue-button" type="submit">{translatedInfo["Save Changes"][props.language]}</button>
                            <button className="blue-button" type="button"
                                    onClick={() => props.setIsEditing(false)}>{translatedInfo["Cancel"][props.language]}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div>
                        <Searchbar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            language={props.language}
                        />
                    </div>

                    <div className="real-estate-card-container">
                        {userRealEstates.length > 0 ? (
                            filteredRealEstate.map((realEstate) => (
                                <div key={realEstate.id}>
                                    <RealEstateCard
                                        realEstate={realEstate}
                                        user={props.user}
                                        favorites={props.favorites}
                                        toggleFavorite={props.toggleFavorite}
                                        showButtons={true}
                                        handleEditToggle={handleEditToggle}
                                        handleDeleteClick={handleDeleteClick}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>{translatedInfo["No Real Estates found for this user."][props.language]}</p>
                        )}
                    </div>
                </>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>{translatedInfo["Confirm Deletion"][props.language]}</h3>
                        <p>{translatedInfo["Are you sure you want to delete this real estate?"][props.language]}</p>
                        <div className="popup-actions">
                            <button onClick={handleConfirmDelete} className="popup-confirm">{translatedInfo["Yes, Delete"][props.language]}</button>
                            <button onClick={handleCancel} className="popup-cancel">{translatedInfo["Cancel"][props.language]}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

