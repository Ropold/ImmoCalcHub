import {useEffect, useState} from "react";
import type {UserDetails} from "./model/UserDetailsModel.ts";
import type {RealEstateModel} from "./model/RealEstateModel.ts";
import "./styles/Profile.css";
import AddRealEstateCard from "./AddRealEstateCard.tsx";
import MyRealEstates from "./MyRealEstates.tsx";
import Favorites from "./Favorites.tsx";
import {translatedInfo} from "./utils/TranslatedInfo.ts";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
    handleNewRealEstateSubmit: (newRealEstate: RealEstateModel) => void;
    handleUpdateRealEstate: (updatedRealEstate: RealEstateModel) => void;
    handleDeleteRealEstate: (realEstateId: string) => void;
    favorites: string[];
    favoritesRealEstates: RealEstateModel[];
    toggleFavorite: (realEstateId: string) => void;
    role: string;
    language: string;
}

export default function Profile(props: Readonly<ProfileProps>) {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"profile" | "add-real-estate" | "my-real-estates" | "favorites">(() => {
        const savedTab = localStorage.getItem("activeTab");
        return (savedTab as "profile" | "add-real-estate" | "my-real-estates" | "favorites") || "profile";
    });

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    return (
        <>
            <div className="profile-container">
                <div className="space-between">
                    <button className={activeTab === "profile" ? "active-profile-button" : "blue-button"}
                            onClick={() => setActiveTab("profile")}>{translatedInfo["Profile GitHub"][props.language]}
                    </button>
                    <button className={activeTab === "favorites" ? "active-profile-button" : "blue-button"}
                            onClick={() => setActiveTab("favorites")}>{translatedInfo["Favorites"][props.language]}
                    </button>
                    <button className={activeTab === "add-real-estate" ? "active-profile-button" : "blue-button"}
                            onClick={() => setActiveTab("add-real-estate")}>{translatedInfo["Add Real Estate"][props.language]}
                    </button>
                    <button className={activeTab === "my-real-estates" ? "active-profile-button" : "blue-button"}
                            onClick={() => {setActiveTab("my-real-estates"); setIsEditing(false)}}>{translatedInfo["My Real Estates"][props.language]}
                    </button>
                </div>
            </div>

            <div>
                {activeTab === "profile" && (
                    <>
                        <h2>{translatedInfo["Profile GitHub"][props.language]}</h2>
                        {props.userDetails ? (
                            <div>
                                <p>{translatedInfo["Username"][props.language]}: {props.userDetails.login}</p>
                                <p>{translatedInfo["Name"][props.language]}: {props.userDetails.name || translatedInfo["No name provided"][props.language]}</p>
                                <p>{translatedInfo["Location"][props.language]}: {props.userDetails.location ?? translatedInfo["No location provided"][props.language]}</p>
                                {props.userDetails.bio && <p>{translatedInfo["Bio"][props.language]}: {props.userDetails.bio}</p>}
                                <p>{translatedInfo["Followers"][props.language]}: {props.userDetails.followers}</p>
                                <p>{translatedInfo["Following"][props.language]}: {props.userDetails.following}</p>
                                <p>{translatedInfo["Public Repositories"][props.language]}: {props.userDetails.public_repos}</p>
                                <p>
                                    {translatedInfo["Profile GitHub"][props.language]}:{" "}
                                    <a href={props.userDetails.html_url} target="_blank" rel="noopener noreferrer">
                                        {translatedInfo["Visit Profile"][props.language]}
                                    </a>
                                </p>
                                {props.userDetails.avatar_url && (
                                    <img
                                        className="profile-container-img"
                                        src={props.userDetails.avatar_url}
                                        alt={props.userDetails.login}
                                    />
                                )}
                                <p>{translatedInfo["Account Created:"][props.language]} {new Date(props.userDetails.created_at).toLocaleDateString()}</p>
                                <p>{translatedInfo["Last Updated:"][props.language]} {new Date(props.userDetails.updated_at).toLocaleDateString()}</p>
                                <h3>{translatedInfo["Your role:"][props.language]} {props.role}</h3>
                            </div>
                        ) : (
                            <p>{translatedInfo["Loading..."][props.language]}</p>
                        )}
                    </>
                )}
                {activeTab === "add-real-estate" && <AddRealEstateCard user={props.user} handleNewRealEstateSubmit={props.handleNewRealEstateSubmit} language={props.language}/>}
                {activeTab === "my-real-estates" && <MyRealEstates user={props.user} favorites={props.favorites} toggleFavorite={props.toggleFavorite} isEditing={isEditing} setIsEditing={setIsEditing} handleUpdateRealEstate={props.handleUpdateRealEstate} handleDeleteRealEstate={props.handleDeleteRealEstate} language={props.language}/>}
                {activeTab === "favorites" && <Favorites user={props.user} favorites={props.favorites} favoritesRealEstates={props.favoritesRealEstates} toggleFavorite={props.toggleFavorite} language={props.language}/>}
            </div>
        </>
    );
}