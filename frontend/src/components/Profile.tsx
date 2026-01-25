import {useEffect, useState} from "react";
import type {UserDetails} from "./model/UserDetailsModel.ts";
import type {RealEstateModel} from "./model/RealEstateModel.ts";
import "./styles/Profile.css";
import AddRealEstateCard from "./AddRealEstateCard.tsx";
import MyRealEstates from "./MyRealEstates.tsx";
import Favorites from "./Favorites.tsx";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
    handleNewRealEstateSubmit: (newRealEstate: RealEstateModel) => void;
    handleUpdateRealEstate: (updatedRealEstate: RealEstateModel) => void;
    handleDeleteRealEstate: (realEstateId: string) => void;
    favorites: string[];
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
                            onClick={() => setActiveTab("profile")}>Profile GitHub
                    </button>
                    <button className={activeTab === "favorites" ? "active-profile-button" : "blue-button"}
                            onClick={() => setActiveTab("favorites")}>Favorites
                    </button>
                    <button className={activeTab === "add-real-estate" ? "active-profile-button" : "blue-button"}
                            onClick={() => setActiveTab("add-real-estate")}>Add Real Estate
                    </button>
                    <button className={activeTab === "my-real-estates" ? "active-profile-button" : "blue-button"}
                            onClick={() => {setActiveTab("my-real-estates"); setIsEditing(false)}}>My Real Estates
                    </button>
                </div>
            </div>

            <div>
                {activeTab === "profile" && (
                    <>
                        <h2>Profile GitHub</h2>
                        {props.userDetails ? (
                            <div>
                                <p>Username: {props.userDetails.login}</p>
                                <p>Name: {props.userDetails.name || "No name provided"}</p>
                                <p>Location: {props.userDetails.location ?? "No location provided"}</p>
                                {props.userDetails.bio && <p>Bio: {props.userDetails.bio}</p>}
                                <p>Followers: {props.userDetails.followers}</p>
                                <p>Following: {props.userDetails.following}</p>
                                <p>Public Repositories: {props.userDetails.public_repos}</p>
                                <p>
                                    Profile GitHub:{" "}
                                    <a href={props.userDetails.html_url} target="_blank" rel="noopener noreferrer">
                                        Visit Profile
                                    </a>
                                </p>
                                {props.userDetails.avatar_url && (
                                    <img
                                        className="profile-container-img"
                                        src={props.userDetails.avatar_url}
                                        alt={props.userDetails.login}
                                    />
                                )}
                                <p>Account Created: {new Date(props.userDetails.created_at).toLocaleDateString()}</p>
                                <p>Last Updated: {new Date(props.userDetails.updated_at).toLocaleDateString()}</p>
                                <h3>Your role: {props.role}</h3>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </>
                )}

                {activeTab === "add-real-estate" && <AddRealEstateCard user={props.user} handleNewRealEstateSubmit={props.handleNewRealEstateSubmit} language={props.language}/>}
                {activeTab === "my-real-estates" && <MyRealEstates user={props.user} favorites={props.favorites} toggleFavorite={props.toggleFavorite} isEditing={isEditing} setIsEditing={setIsEditing} handleUpdateRealEstate={props.handleUpdateRealEstate} handleDeleteRealEstate={props.handleDeleteRealEstate} language={props.language}/>}
                {activeTab === "favorites" && <Favorites user={props.user} favorites={props.favorites} toggleFavorite={props.toggleFavorite} language={props.language}/>}
            </div>
        </>
    );
}