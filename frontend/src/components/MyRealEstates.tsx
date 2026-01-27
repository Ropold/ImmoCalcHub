import type {RealEstateModel} from "./model/RealEstateModel.ts";
import {useState} from "react";
import {useLocation} from "react-router-dom";

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
    const [userRealEstate, setUserRealEstate] = useState<RealEstateModel[]>([]);
    const [editData, setEditData] = useState<RealEstateModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [realEstateToDelete, setRealEstateToDelete] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);
    const [imageDeleted, setImageDeleted] = useState(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredRealEstate, setFilteredRealEstate] = useState<RealEstateModel[]>([]);

    const location = useLocation();



    return (
        <h2>
            My Real Estates Component Placeholder
        </h2>
    );
}

