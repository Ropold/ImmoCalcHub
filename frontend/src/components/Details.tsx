import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {DefaultRealEstate, type RealEstateModel} from "./model/RealEstateModel.ts";
import {DefaultUserDetails, type UserDetails} from "./model/UserDetailsModel.ts";
import "./styles/Details.css";
import "./styles/Profile.css"
import MapBoxDetails from "./MapBoxDetails.tsx";
import {translatedInfo} from "./utils/TranslatedInfo.ts";

type DetailsProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (realEstateId: string) => void;
    language: string;
}

export default function Details(props: Readonly<DetailsProps>) {
    const [realEstate, setRealEstate] = useState<RealEstateModel>(DefaultRealEstate);
    const [githubUser, setGithubUser] = useState<UserDetails>(DefaultUserDetails);
    const {id} = useParams<{ id: string }>();

    const isFavorite = props.favorites.includes(realEstate.id);

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
                <p><strong>{translatedInfo["Description"][props.language]}:</strong> {realEstate.description}</p>
                <p><strong>{translatedInfo["Address"][props.language]}:</strong> {realEstate.address}</p>
                <p><strong>{translatedInfo["Price"][props.language]}:</strong> {realEstate.price.toLocaleString("de-DE")} € ({realEstate.priceType === "PURCHASE" ? translatedInfo["Purchase"][props.language] : translatedInfo["Rent"][props.language]})</p>
                <p><strong>{translatedInfo["Total Floor Area"][props.language]}:</strong> {realEstate.totalFloorArea.toLocaleString("de-DE")} m²</p>
                <p><strong>{translatedInfo["Living Area (according to WoFlV)"][props.language]}:</strong> {realEstate.totalLivingAreaWoFlV.toLocaleString("de-DE")} m²</p>
                <p><strong>{translatedInfo["Number of Rooms"][props.language]}:</strong> {realEstate.rooms.length}</p>
                <p><strong>{translatedInfo["Created At"][props.language]}:</strong> {new Date(realEstate.createdAt).toLocaleDateString("de-DE")}</p>

                <div className="details-img-container">
                    {realEstate.imageUrl && (
                        <img
                            className="details-image-larger"
                            src={realEstate.imageUrl}
                            alt={realEstate.realEstateTitle}
                        />
                    )}
                </div>

                {props.user !== "anonymousUser" && (
                    <button
                        className={`blue-button margin-top-20 ${isFavorite ? "favorite-on" : "favorite-off"}`}
                        onClick={() => props.toggleFavorite(realEstate.id)}
                    >
                        ♥
                    </button>
                )}

                {realEstate.rooms.length > 0 && (
                    <div className="rooms-section">
                        <h3 className="rooms-section-title">{translatedInfo["Rooms"][props.language]}</h3>
                        <div className="rooms-grid">
                        {realEstate.rooms.map((room, roomIndex) => (
                            <div key={roomIndex} className="room-card">
                                <p><strong>{translatedInfo["Room Title"][props.language]}:</strong> {room.roomTitel || `Raum ${roomIndex + 1}`} | <strong>Raumtyp:</strong> {room.roomType}</p>
                                {room.roomSections.length > 0 && (
                                    <div className="room-sections">
                                        {room.roomSections.map((section, sectionIndex) => (
                                            <div key={sectionIndex} className="room-section-card">
                                                {section.roomSectionTitel && <p><strong>{translatedInfo["Section Title"][props.language]}:</strong> {section.roomSectionTitel}</p>}
                                                <p>{translatedInfo["Length"][props.language]}: {section.length} m × {translatedInfo["Width"][props.language]}: {section.width} m × {translatedInfo["Height"][props.language]}: {section.height} m</p>
                                                <p>{translatedInfo["Area"][props.language]}: {(section.length * section.width).toFixed(2)} m²</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        </div>
                    </div>
                )}

            </div>



            <MapBoxDetails realEstateAddress={realEstate.address}/>

            <div>
                <h3>{translatedInfo["Added by User"][props.language]}</h3>
                <p><strong>{translatedInfo["Github-User"][props.language]}:</strong> {githubUser.login}</p>
                <p><strong>{translatedInfo["GitHub Profile"][props.language]}:</strong> <a href={githubUser.html_url} target="_blank" rel="noopener noreferrer">{translatedInfo["Visit Profile"][props.language]}</a></p>
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