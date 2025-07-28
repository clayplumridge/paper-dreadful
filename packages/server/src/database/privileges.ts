export const PRIVILEGES = {
    // Data management privs
    MANAGE_PRIVILEGES: 100,
    RUN_SCRYFALL_IMPORT: 101,

    // Admin privs
    BAN_USER: 200,
    UNBAN_USER: 201,

    // Format privs
    CREATE_FORMAT: 300,
    EDIT_OWNED_FORMAT: 301,
    EDIT_ANY_FORMAT: 302, // Admin
    DELETE_OWNED_FORMAT: 303,
    DELETE_ANY_FORMAT: 304, // Admin

    // Deck privs
    CREATE_DECK: 400,
    EDIT_OWNED_DECK: 401,
    EDIT_ANY_DECK: 402, // Admin
    DELETE_OWNED_DECK: 403,
    DELETE_ANY_DECK: 404, // Admin
} as const;

export const DEFAULT_PRIVILEGES = new Set<number>([
    PRIVILEGES.CREATE_DECK,
    PRIVILEGES.EDIT_OWNED_DECK,
    PRIVILEGES.DELETE_OWNED_DECK,
    PRIVILEGES.CREATE_FORMAT,
    PRIVILEGES.EDIT_OWNED_FORMAT,
]);

function verifyUnique(privs: Record<string, number>) {
    const privIds = Object.values(privs);

    if(privIds.length !== new Set(privIds).size) {
        throw new Error("Invalid privileges array: Some privs share IDs");
    }
}
verifyUnique(PRIVILEGES);
