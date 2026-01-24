import {useNavigate} from "react-router-dom";
import type {RealEstateModel} from "./model/RealEstateModel.ts";
import "./styles/RealEstateCard.css"

type RealEstateCardProps = {
    realEstate: RealEstateModel;
    user: string;
    favorites: string[];
    toggleFavorite: (realEstateId: string) => void;
    showButtons?: boolean;
    handleEditToggle?: (id: string) => void;
    handleDeleteClick?: (id: string) => void;
    language: string;
}

export default function RealEstateCard(props: Readonly<RealEstateCardProps>){
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/real-estate/${props.realEstate.id}`);
    }

    const isFavorite = props.favorites.includes(props.realEstate.id);

    return (
        <div className="real-estate-card" onClick={handleCardClick}>
            <h3>{props.realEstate.realEstateTitle}</h3>
            <img
                src={props.realEstate.imageUrl ?? undefined}
                alt={props.realEstate.realEstateTitle}
                className="real-estate-card-image"
            />

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

            {props.showButtons && (
                <div className="space-between">
                    <button
                        className="button-group-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.handleEditToggle?.(props.realEstate.id);
                        }}
                    >
                        Edit
                    </button>
                    <button
                        id="button-delete"
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
    )
}