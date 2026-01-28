export type PriceType = "PURCHASE" | "RENT" | "MONTHLY_RENT" | "YEARLY_RENT";

export const PRICE_TYPES: PriceType[] = ["PURCHASE", "RENT", "MONTHLY_RENT", "YEARLY_RENT"];

export const translatedPriceType: Record<PriceType, Record<string, string>> = {
    "PURCHASE": {
        "en": "Purchase",
        "de": "Kauf",
        "pl": "Zakup",
        "es": "Compra",
        "fr": "Achat",
        "it": "Acquisto",
        "ru": "Покупка"
    },
    "RENT": {
        "en": "Rent",
        "de": "Miete",
        "pl": "Wynajem",
        "es": "Alquiler",
        "fr": "Louer",
        "it": "Affitto",
        "ru": "Аренда"
    },
    "MONTHLY_RENT": {
        "en": "Monthly Rent",
        "de": "Monatsmiete",
        "pl": "Miesięczny czynsz",
        "es": "Alquiler mensual",
        "fr": "Loyer mensuel",
        "it": "Affitto mensile",
        "ru": "Месячная аренда"
    },
    "YEARLY_RENT": {
        "en": "Yearly Rent",
        "de": "Jahresmiete",
        "pl": "Roczny czynsz",
        "es": "Alquiler anual",
        "fr": "Loyer annuel",
        "it": "Affitto annuale",
        "ru": "Годовая аренда"
    }
};
