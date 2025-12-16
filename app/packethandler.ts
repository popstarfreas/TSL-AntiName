import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import GenericPacketHandler from "terrariaserver-lite/handlers/genericpackethandler";
import Packet from "terrariaserver-lite/packet";
import AntiName from "./index.js";

import { PlayerInfoPacket } from "terraria-packet";

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
    const playerInfoResult = PlayerInfoPacket.parse(packet.data);
    if (playerInfoResult.TAG === "Error") {
      if (playerInfoResult._0.error instanceof Error) {
        client.server.logger.error(`Failed to parse PlayerInfo packet: ${playerInfoResult._0.context}; ${playerInfoResult._0.error.message}`);
      } else {
        client.server.logger.error(`Failed to parse PlayerInfo packet: ${playerInfoResult._0.context}`);
      }
      return false;
    }

    const playerInfo = playerInfoResult._0;
    const name = playerInfo.name;
    const nameResult = this._antiName.processClientName(name);
    switch (nameResult.type) {
      case "ACCEPTED_RENAME":
        break;
      case "REWRITTEN_RENAME":
        const dataResult = PlayerInfoPacket.toBuffer({ ...playerInfo, playerId: client.id ?? 0, name: nameResult.newName })
        if (dataResult.TAG === "Error") {
          client.server.logger.error(`Failed to serialize PlayerInfo packet: ${dataResult._0.context}; ${dataResult._0.error.message}`);
          return false;
        }
        packet.data = dataResult._0;
        break;
      case "REJECTED_RENAME":
        client.disconnect(nameResult.reason || "Your name is not allowed.");
        break;
    }

    return false;
  }
}

export default PacketHandler;
