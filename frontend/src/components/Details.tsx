import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {DefaultRealEstate, type RealEstateModel} from "./model/RealEstateModel.ts";
import {DefaultUserDetails, type UserDetails} from "./model/UserDetailsModel.ts";
import "./styles/Details.css";
import "./styles/Profile.css"

type DetailsProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (realEstateId: string) => void;
    language: string;
}

export default function Details({user, favorites, toggleFavorite}: Readonly<DetailsProps>) {
    const [realEstate, setRealEstate] = useState<RealEstateModel>(DefaultRealEstate);
    const [githubUser, setGithubUser] = useState<UserDetails>(DefaultUserDetails);
    const {id} = useParams<{ id: string }>();

    const isFavorite = favorites.includes(realEstate.id);

    useEffect(() => {
        if (!id) return;
        axios.get(`/api/immo-calc-hub/${id}`)
            .then((response) => setRealEstate(response.data))
            .catch((error) => console.error("Error fetching Real Estate details", error));
    }, [id]);

    useEffect(() => {
        if (!realEstate.githubId) return;
        axios.get(`https://api.github.com/user/${realEstate.githubId}`)
            .then((response) => setGithubUser(response.data))
            .catch((error) => console.error("Error fetching Github-User", error));
    }, [realEstate.githubId]);

    return (
        <>
            <div className="details-container">
                <h2>{realEstate.realEstateTitle}</h2>
                <p><strong>Beschreibung:</strong> {realEstate.description}</p>
                <p><strong>Adresse:</strong> {realEstate.address}</p>
                <p><strong>Preis:</strong> {realEstate.price.toLocaleString("de-DE")} € ({realEstate.priceType === "PURCHASE" ? "Kauf" : "Miete"})</p>
                <p><strong>Gesamtfläche:</strong> {realEstate.totalFloorArea.toLocaleString("de-DE")} m²</p>
                <p><strong>Wohnfläche (nach WoFlV):</strong> {realEstate.totalLivingAreaWoFlV.toLocaleString("de-DE")} m²</p>
                <p><strong>Anzahl Räume:</strong> {realEstate.rooms.length}</p>
                <p><strong>Erstellt am:</strong> {new Date(realEstate.createdAt).toLocaleDateString("de-DE")}</p>

                <div className="details-img-container">
                    {realEstate.imageUrl && (
                        <img
                            className="details-image-larger"
                            src={realEstate.imageUrl}
                            alt={realEstate.realEstateTitle}
                        />
                    )}
                </div>

                {user !== "anonymousUser" && (
                    <button
                        className={`button-group-button margin-top-20 ${isFavorite ? "favorite-on" : "favorite-off"}`}
                        onClick={() => toggleFavorite(realEstate.id)}
                    >
                        ♥
                    </button>
                )}
            </div>

            <div>
                <h3>Added by User</h3>
                <p><strong>Github-User:</strong> {githubUser.login}</p>
                <p><strong>GitHub Profile:</strong> <a href={githubUser.html_url} target="_blank" rel="noopener noreferrer">Visit Profile</a></p>
                {githubUser.avatar_url && (
                    <img
                        className="profile-container-img"
                        src={githubUser.avatar_url}
                        alt={`${githubUser.login}'s avatar`}
                    />
                )}
            </div>
        </>
    )
}