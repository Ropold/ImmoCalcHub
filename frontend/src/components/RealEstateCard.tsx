import {useNavigate} from "react-router-dom";
import type {RealEstateModel} from "./model/RealEstateModel.ts";
import "./styles/RealEstateCard.css"
import houseLogo from "../assets/house-logo.jpg";

type RealEstateCardProps = {
    realEstate: RealEstateModel;
    user: string;
    favorites: string[];
    toggleFavorite: (realEstateId: string) => void;
    showButtons?: boolean;
    handleEditToggle?: (id: string) => void;
    handleDeleteClick?: (id: string) => void;
}

export default function RealEstateCard(props: Readonly<RealEstateCardProps>){
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/real-estate/${props.realEstate.id}`);
    }

    const isFavorite = props.favorites.includes(props.realEstate.id);

    return (
        <div className="real-estate-card" onClick={handleCardClick}>
            {/* 1. Herz */}
            <div className="card-section card-heart">
                {props.user !== "anonymousUser" && (
                    <button
                        id="button-favorite-real-estate-card"
                        onClick={(event) => {
                            event.stopPropagation();
                            props.toggleFavorite(props.realEstate.id);
                        }}
                        className={isFavorite ? "favorite-on" : "favorite-off"}
                    >
                        ♥
                    </button>
                )}
            </div>

            {/* 2. Titel */}
            <div className="card-section card-title">
                <h3>{props.realEstate.realEstateTitle}</h3>
            </div>

            {/* 3. Bild */}
            <div className="card-section card-image">
                <img
                    src={props.realEstate.imageUrl ?? houseLogo}
                    alt={props.realEstate.realEstateTitle}
                    className="real-estate-card-image"
                />
            </div>

            {/* 4. Buttons */}
            <div className="card-section card-buttons">
                {props.showButtons && (
                    <div className="space-between">
                        <button
                            className="blue-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.handleEditToggle?.(props.realEstate.id);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className="red-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.handleDeleteClick?.(props.realEstate.id);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}