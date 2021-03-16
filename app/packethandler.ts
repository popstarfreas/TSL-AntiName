import PacketReader from "@popstarfreas/packetfactory/packetreader";
import PacketWriter from "@popstarfreas/packetfactory/packetwriter";
import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import GenericPacketHandler from "terrariaserver-lite/handlers/genericpackethandler";
import Packet from "terrariaserver-lite/packet";
import AntiName from "./";

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
        const skinVariant = reader.readByte();
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
        const torchFlags = reader.readByte();

        const nameResult = this._antiName.processClientName(name);
        switch (nameResult.type) {
            case "ACCEPTED_RENAME":
                break;
            case "REWRITTEN_RENAME":
                const newPacket = new PacketWriter()
                    .setType(packet.packetType)
                    .packByte(0)
                    .packByte(skinVariant)
                    .packByte(hair)
                    .packString(nameResult.newName)
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
                    .packByte(torchFlags)
                    .data;

                packet.data = newPacket;
                break;
            case "REJECTED_RENAME":
                client.disconnect(nameResult.reason || "Your name is not allowed.");
                break;
        }

        return false;
    }
}

export default PacketHandler;
