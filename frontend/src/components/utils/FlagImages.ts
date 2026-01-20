
import dePic from "../../assets/flags/de.svg";
import gbPic from "../../assets/flags/gb.svg";
import plPic from "../../assets/flags/pl.svg";
import esPic from "../../assets/flags/es.svg";
import frPic from "../../assets/flags/fr.svg";
import itPic from "../../assets/flags/it.svg";
import ruPic from "../../assets/flags/ru.svg";

export const LanguagesImages: Record<string, string> = {
    de: dePic,
    en: gbPic,
    pl: plPic,
    es: esPic,
    fr: frPic,
    it: itPic,
    ru: ruPic,
};

export const countryNameToIsoCode: Record<string, string> = {
    Germany: "de",
    England: "gb",
    Poland: "pl",
    Spain: "es",
    France: "fr",
    Italy: "it",
    Russia: "ru",
}