import type {RealEstateModel} from "./model/RealEstateModel.ts";
import RealEstateCard from "./RealEstateCard.tsx";

type FavoritesProps = {
    user: string;
    favorites: string[];
    favoritesRealEstates: RealEstateModel[];
    toggleFavorite: (realEstateId: string) => void;
    language: string;
}

export default function Favorites(props: Readonly<FavoritesProps>) {
    return (
        <div className="real-estate-card-container">
            {props.favoritesRealEstates.length > 0 ? (
                props.favoritesRealEstates.map((r: RealEstateModel) => (
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

