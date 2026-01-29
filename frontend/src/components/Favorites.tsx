import {useEffect, useState} from "react";
import type {RealEstateModel} from "./model/RealEstateModel.ts";
import RealEstateCard from "./RealEstateCard.tsx";
import axios from "axios";

type FavoritesProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (realEstateId: string) => void;
    language: string;
}

export default function Favorites(props: Readonly<FavoritesProps>) {
    const [favoritesRealEstates, setFavoritesRealEstates] = useState<RealEstateModel[]>([]);

    useEffect(() => {
        axios
            .get(`/api/users/favorites`)
            .then((response) => {
                setFavoritesRealEstates(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [props.user, props.favorites]);

    return (
        <div className="real-estate-card-container">
            {favoritesRealEstates.length > 0 ? (
                favoritesRealEstates.map((r: RealEstateModel) => (
                    <RealEstateCard
                        key={r.id}
                        realEstate={r}
                        user={props.user}
                        favorites={props.favorites}
                        toggleFavorite={props.toggleFavorite}
                    />
                ))
            ) : (
                <p>No Real Estates in favorites</p>
            )}
        </div>
    );
}

