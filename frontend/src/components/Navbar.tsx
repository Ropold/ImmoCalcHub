import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./styles/Navbar.css";
import * as React from "react";
import headerLogo from "../assets/rainbow-logo-small.png"
import {LanguagesImages} from "./utils/FlagImages.ts";
import {translatedGameInfo} from "./utils/TranslatedGameInfo.ts";
import "./styles/Buttons.css"

type NavbarProps = {
    user: string;
    getUser: () => void;
    getUserDetails: () => void;
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>
}

function loginWithGithub() {
    const host = window.location.host === "localhost:5173" ? "http://localhost:8080" : window.location.origin;
    window.open(host + "/oauth2/authorization/github", "_self");
}

export default function Navbar(props: Readonly<NavbarProps>) {
    const [showLanguagePopup, setShowLanguagePopup] = React.useState(false);

    const navigate = useNavigate();

    function logoutFromGithub() {
        axios
            .post("/api/users/logout")
            .then(() => {
                props.getUser();
                props.getUserDetails();
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }

    return (
        <nav className="navbar">
            <button className="blue-button" onClick={() => navigate("/")}>Home</button>
            <div
                className="green-button clickable-header"
                onClick={() => {
                    navigate("/items");
                }}
            >
                <h2 className="header-title">Items</h2>
                <img src={headerLogo} alt="Arc Raider Hub Logo" className="logo-image" />
            </div>



            {showLanguagePopup && (
                <div
                    className="popup-overlay"
                    onClick={() => setShowLanguagePopup(false)}
                >
                    <div
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Select Language</h2>
                        <div className="popup-language-options">
                            {["en", "de", "pl", "es", "fr", "it", "ru"].map((lang) => (
                                <button
                                    key={lang}
                                    className="language-option-button"
                                    onClick={() => {
                                        props.setLanguage(lang);
                                        setShowLanguagePopup(false);
                                    }}
                                >
                                    <img
                                        src={LanguagesImages[lang]}
                                        alt={lang}
                                        className="language-flag"
                                    />
                                    {translatedGameInfo["getLanguageName"][lang]}
                                </button>
                            ))}
                        </div>
                        <button
                            className="popup-cancel margin-top-20"
                            onClick={() => setShowLanguagePopup(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}



            {props.user !== "anonymousUser" ? (
                <>
                    <button className="purple-button" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="blue-button" onClick={logoutFromGithub}>Logout</button>
                </>
            ) : (
                <button className="blue-button" onClick={loginWithGithub}>Login with GitHub</button>
            )}
        </nav>
    );
}