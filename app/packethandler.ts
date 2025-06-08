import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import GenericPacketHandler from "terrariaserver-lite/handlers/genericpackethandler";
import Packet from "terrariaserver-lite/packet";
import AntiName from "./";
import * as PlayerInfo from "terraria-packet/src/packet/Packet_PlayerInfo.gen";

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
    const playerInfo = PlayerInfo.parse(packet.data);
    if (typeof playerInfo === "undefined") {
      return false;
    }

    const name = playerInfo.name;
    const nameResult = this._antiName.processClientName(name);
    switch (nameResult.type) {
      case "ACCEPTED_RENAME":
        break;
      case "REWRITTEN_RENAME":
        packet.data = PlayerInfo.toBuffer({ ...playerInfo, playerId: client.id ?? 0, name: nameResult.newName });
        break;
      case "REJECTED_RENAME":
        client.disconnect(nameResult.reason || "Your name is not allowed.");
        break;
    }

    return false;
  }
}

export default PacketHandler;
