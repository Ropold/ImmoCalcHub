import "./styles/Searchbar.css"

type SearchBarProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

export default function Searchbar(props: Readonly<SearchBarProps>) {

    function handleReset() {
        props.setSearchQuery("");
    }
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by Real Estate Name or other fields..."
                value={props.searchQuery}
                onChange={(e) => props.setSearchQuery(e.target.value)}
                className="search-input"
            />

            <button
                onClick={handleReset}
                className={`${props.searchQuery ? "blue-button" : "button-grey"}`}
            >
                Reset Filters
            </button>
        </div>
    );
}