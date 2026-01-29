import "./styles/Searchbar.css"
import {translatedInfo} from "./utils/TranslatedInfo.ts";

type SearchBarProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    language: string;
}

export default function Searchbar(props: Readonly<SearchBarProps>) {

    function handleReset() {
        props.setSearchQuery("");
    }
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder={translatedInfo["Search by Real Estate Name or others Field"][props.language]}
                value={props.searchQuery}
                onChange={(e) => props.setSearchQuery(e.target.value)}
                className="search-input"
            />

            <button
                onClick={handleReset}
                className={`search-button ${props.searchQuery ? "blue-button" : "button-grey"}`}
            >
                {translatedInfo["Reset"][props.language]}
            </button>
        </div>
    );
}