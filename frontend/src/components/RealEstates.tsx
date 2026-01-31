import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import SearchBar from "./Searchbar.tsx";
import RealEstateCard from "./RealEstateCard.tsx";
import type {RealEstateModel} from "./model/RealEstateModel.ts";

type RealEstatesProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (realEstateId: string) => void;
    allRealEstates: RealEstateModel[];
    getAllRealEstates: () => void;
    language: string;
}

export default function RealEstates(props: Readonly<RealEstatesProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredRealEstates, setFilteredRealEstates] = useState<RealEstateModel[]>([]);

    const location = useLocation();

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function removeDiacritics(str: string): string {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function filterRealEstates(realEstates: RealEstateModel[], query: string): RealEstateModel[] {
        const normalizedQuery = removeDiacritics(query.toLowerCase());
        return realEstates.filter(realEstate => {
            return removeDiacritics(realEstate.realEstateTitle.toLowerCase()).includes(normalizedQuery) ||
                   removeDiacritics(realEstate.description.toLowerCase()).includes(normalizedQuery) ||
                   removeDiacritics(realEstate.address.toLowerCase()).includes(normalizedQuery);
        });
    }

    useEffect(() => {
        setFilteredRealEstates(filterRealEstates(props.allRealEstates, searchQuery));
    }, [props.allRealEstates, searchQuery]);


    return(
        <>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                language={props.language}
            />
            <div className="real-estate-card-container">
                {filteredRealEstates.map((realEstate: RealEstateModel) => (
                    <RealEstateCard
                        key={realEstate.id}
                        realEstate={realEstate}
                        user={props.user}
                        favorites={props.favorites}
                        toggleFavorite={props.toggleFavorite}
                    />
                ))}
            </div>
        </>
    )
}