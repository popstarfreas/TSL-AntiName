import TerrariaServer from "terrariaserver-lite/terrariaserver";
import Extension from "terrariaserver-lite/extensions/extension";
import PacketHandler from "./packethandler";

class AntiName extends Extension {
    public name = "AntiName";
    public version = "v1.0";
    public regex = /[^\da-z!@#\$%\^\&\*\(\)\-\+~ ;{}|\[\]:\.,_`]/i;
    public static maxCapitalRatio = 0.6;

    constructor(server: TerrariaServer) {
        super(server);
        this.packetHandler = new PacketHandler(this);
    }

}

export default AntiName;
