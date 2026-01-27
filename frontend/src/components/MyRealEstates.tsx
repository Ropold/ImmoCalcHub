import type {RealEstateModel} from "./model/RealEstateModel.ts";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";

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
                alert("An unexpected error occurred. Please try again.");
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
                    alert("An unexpected error occurred. Please try again.");
                })
                .finally(() => {
                    setRealEstateToDelete(null);
                    setShowPopup(false);
                });
        }
    }



    return (
        <h2>
            My Real Estates Component Placeholder

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this real estate?</p>
                        <div className="popup-actions">
                            <button onClick={handleConfirmDelete} className="popup-confirm">Yes, Delete</button>
                            <button onClick={handleCancel} className="popup-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </h2>
    );
}

