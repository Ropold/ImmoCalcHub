export type RoomType =
    | "LIVING_ROOM"
    | "BEDROOM"
    | "KITCHEN"
    | "BATHROOM"
    | "HALLWAY"
    | "BALCONY"
    | "TERRACE"
    | "BASEMENT"
    | "STORAGE"
    | "OFFICE"
    | "DINING_ROOM"
    | "OTHER";

export const ROOM_TYPES: RoomType[] = [
    "LIVING_ROOM", "BEDROOM", "KITCHEN", "BATHROOM", "HALLWAY",
    "BALCONY", "TERRACE", "BASEMENT", "STORAGE", "OFFICE", "DINING_ROOM", "OTHER"
];

export const translatedRoomType: Record<RoomType, Record<string, string>> = {
    "LIVING_ROOM": {
        "en": "Living Room",
        "de": "Wohnzimmer",
        "pl": "Salon",
        "es": "Sala de estar",
        "fr": "Salon",
        "it": "Soggiorno",
        "ru": "Гостиная"
    },
    "BEDROOM": {
        "en": "Bedroom",
        "de": "Schlafzimmer",
        "pl": "Sypialnia",
        "es": "Dormitorio",
        "fr": "Chambre",
        "it": "Camera da letto",
        "ru": "Спальня"
    },
    "KITCHEN": {
        "en": "Kitchen",
        "de": "Küche",
        "pl": "Kuchnia",
        "es": "Cocina",
        "fr": "Cuisine",
        "it": "Cucina",
        "ru": "Кухня"
    },
    "BATHROOM": {
        "en": "Bathroom",
        "de": "Badezimmer",
        "pl": "Łazienka",
        "es": "Baño",
        "fr": "Salle de bain",
        "it": "Bagno",
        "ru": "Ванная"
    },
    "HALLWAY": {
        "en": "Hallway",
        "de": "Flur",
        "pl": "Korytarz",
        "es": "Pasillo",
        "fr": "Couloir",
        "it": "Corridoio",
        "ru": "Коридор"
    },
    "BALCONY": {
        "en": "Balcony",
        "de": "Balkon",
        "pl": "Balkon",
        "es": "Balcón",
        "fr": "Balcon",
        "it": "Balcone",
        "ru": "Балкон"
    },
    "TERRACE": {
        "en": "Terrace",
        "de": "Terrasse",
        "pl": "Taras",
        "es": "Terraza",
        "fr": "Terrasse",
        "it": "Terrazza",
        "ru": "Терраса"
    },
    "BASEMENT": {
        "en": "Basement",
        "de": "Keller",
        "pl": "Piwnica",
        "es": "Sótano",
        "fr": "Sous-sol",
        "it": "Seminterrato",
        "ru": "Подвал"
    },
    "STORAGE": {
        "en": "Storage",
        "de": "Abstellraum",
        "pl": "Schowek",
        "es": "Almacén",
        "fr": "Rangement",
        "it": "Ripostiglio",
        "ru": "Кладовка"
    },
    "OFFICE": {
        "en": "Office",
        "de": "Büro",
        "pl": "Biuro",
        "es": "Oficina",
        "fr": "Bureau",
        "it": "Ufficio",
        "ru": "Офис"
    },
    "DINING_ROOM": {
        "en": "Dining Room",
        "de": "Esszimmer",
        "pl": "Jadalnia",
        "es": "Comedor",
        "fr": "Salle à manger",
        "it": "Sala da pranzo",
        "ru": "Столовая"
    },
    "OTHER": {
        "en": "Other",
        "de": "Sonstiges",
        "pl": "Inne",
        "es": "Otro",
        "fr": "Autre",
        "it": "Altro",
        "ru": "Другое"
    }
};