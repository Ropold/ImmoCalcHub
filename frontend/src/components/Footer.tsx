import {translatedInfo} from "./utils/TranslatedInfo.ts";

type FooterProps = {
    language: string;
}

export default function Footer(props: Readonly<FooterProps>) {
    return (
        <footer className="footer">
            <p>Immo Calc Hub 🧮 2025 🏠{translatedInfo["by"][props.language]} GSO-FI507</p>
        </footer>
    )
}