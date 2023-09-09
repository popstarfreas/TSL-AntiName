import TerrariaServer from "terrariaserver-lite/terrariaserver";
import Extension, {RenameResult} from "terrariaserver-lite/extensions/extension";
import PacketHandler from "./packethandler";
import Client from "terrariaserver-lite/client";
import Utils from "./utils";

class AntiName extends Extension {
    public name = "AntiName";
    public version = "v1.0";
    public regex = /[^\da-z!@#\$%\^\&\*\(\)\-\+~ ;{}|:\.,_`]/i;
    public static maxCapitalRatio = 0.6;

    constructor(server: TerrariaServer) {
        super(server);
        this.packetHandler = new PacketHandler(this);
    }

    public preClientRename(client: Client, newName: string): RenameResult {
        return this.processClientName(newName);
    }

    public processClientName(name: string): RenameResult {
        if (name.length < 2) {
            return {
                type: "REJECTED_RENAME",
                reason: "Your name is too short. (Min 2 chars)"
            }
        } else if (name.length > 20) {
            return {
                type: "REJECTED_RENAME",
                reason: "Your name is too long. (Max 20 chars)"
            }
        } else if (Utils.countLetters(name) === 0) {
            return {
                type: "REJECTED_RENAME",
                reason: "Your name does not contain any letters or numbers"
            }
        } else if (this.regex.test(name)) {
            const charactersUsed = {};
            let characters = "";
            for (const c of name) {
                if (!charactersUsed[c] && this.regex.test(c)) {
                    characters += c;
                }
            }

            return {
                type: "REJECTED_RENAME",
                reason: `Your name cannot contain these characters: ${characters}`
            }
        } else if (Utils.countCapitals(name) / Utils.countLetters(name) > AntiName.maxCapitalRatio) {
            return {
                type: "REJECTED_RENAME",
                reason: `Your name contains too many capital letters.`
            }
        } else if (/admin|moderator/ig.test(name)) {
            return {
                type: "REJECTED_RENAME",
                reason: `Your name cannot contain misleading keywords such as "admin" or "moderator"`
            }
        } else if (/fuck|shit|cunt|nigger|nigga|penis|porn|hentai|vagina|\banal\b/ig.test(name)) {
            return {
                type: "REJECTED_RENAME",
                reason: `Your name cannot contain profanity.`
            }
        }

        const trimmedName = Utils.removeRepeatedCharacters(name);
        const strippedName = Utils.stripTags(trimmedName);
        if (strippedName !== trimmedName && trimmedName !== name) {
            return {
                type: "REWRITTEN_RENAME",
                newName: strippedName,
                reason: "Your name contains repeated characters. Your name contains chat tags.",
            }
        } else if (strippedName !== trimmedName) {
            return {
                type: "REWRITTEN_RENAME",
                newName: strippedName,
                reason: "Your name contains chat tags.",
            }
        } else if (trimmedName !== name) {
            return {
                type: "REWRITTEN_RENAME",
                newName: strippedName,
                reason: "Your name contains repeated characters.",
            }
        }

        return {
            type: "ACCEPTED_RENAME",
        }
    }
}

export default AntiName;
