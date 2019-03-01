import PacketReader from "dimensions/packets/packetreader";
import PacketWriter from "dimensions/packets/packetwriter";
import PacketTypes from "dimensions/packettypes";
import Client from "../../client";
import GenericPacketHandler from "../../handlers/genericpackethandler";
import Packet from "../../packet";
import AntiName from "./";
import Utils from "./utils";

class PacketHandler implements GenericPacketHandler {
    private _antiName: AntiName;

    constructor(antiName: AntiName) {
        this._antiName = antiName;
    }

    public handlePacket(client: Client, packet: Packet): boolean {
        let handled = false;
        switch (packet.packetType) {
            case PacketTypes.PlayerInfo:
                handled = this.handlePlayerInfo(client, packet);
                break;
        }

        return handled;
    }

    private handlePlayerInfo(client: Client, packet: Packet): boolean {
        const reader = new PacketReader(packet.data);
        reader.readByte(); // Player ID
        const skinVarient = reader.readByte();
        const hair = reader.readByte();
        const name = reader.readString();
        const hairDye = reader.readByte();
        const hideVisuals = reader.readByte();
        const hideVisuals2 = reader.readByte();
        const hideMisc = reader.readByte();
        const hairColor = reader.readColor();
        const skinColor = reader.readColor();
        const eyeColor = reader.readColor();
        const shirtColor = reader.readColor();
        const underShirtColor = reader.readColor();
        const pantsColor = reader.readColor();
        const shoeColor = reader.readColor();
        const difficulty = reader.readByte();

        if (name.length < 2) {
            client.disconnect(`Your name is too short. (Min 2 chars)`);
        } else if (name.length > 30) {
            client.disconnect(`Your name is too long. (Max 30 chars)`);
        } else if (Utils.countLetters(name) === 0) {
            client.disconnect(`Your name does not contain any letters or numbers`);
        } else if (this._antiName.regex.test(name)) {
            const charactersUsed = {};
            let characters = "";
            for (const c of name) {
                if (!charactersUsed[c]) {
                    characters += c;
                }
            }

            client.disconnect(`Your name cannot contain these characters: ${characters}`);
        } else if (Utils.countCapitals(name) / Utils.countLetters(name) > AntiName.maxCapitalRatio) {
            client.disconnect(`Your name contains too many capital letters.`);
        } else if (/admin|moderator/ig.test(name)) {
            client.disconnect(`Your name cannot contain misleading keywords such as "admin" or moderator"`);
        } else if (/fuck|shit|cunt|nigger|nigga|cock|penis|porn|hentai|vagina|\banal\b/ig.test(name)) {
            client.disconnect(`Your name cannot contain profanity.`);
        }

        const trimmedName = Utils.removeRepeatedCharacters(name);
        const strippedName = Utils.stripTags(trimmedName);
        if (strippedName !== name) {
            const newPacket = new PacketWriter()
                .setType(packet.packetType)
                .packByte(0)
                .packByte(skinVarient)
                .packByte(hair)
                .packString(strippedName)
                .packByte(hairDye)
                .packByte(hideVisuals)
                .packByte(hideVisuals2)
                .packByte(hideMisc)
                .packColor(hairColor)
                .packColor(skinColor)
                .packColor(eyeColor)
                .packColor(shirtColor)
                .packColor(underShirtColor)
                .packColor(pantsColor)
                .packColor(shoeColor)
                .packByte(difficulty)
                .data;

            packet.data = newPacket;
        }
        return false;
    }
}

export default PacketHandler;
