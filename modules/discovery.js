const dgram = require("dgram");
const constants = require("../constants");

class Discovery {
    constructor(_port) {
        this.server = {};
        this.server.port = _port;
        this.server.address = '0.0.0.0';

        this.client = {};
    }

    Start(id) {
        try {
            // start discovery server
            this.server.self = this.initServer(this.server.address, this.server.port);
            this.server.self.on("message", (msg, rinfo) => {
                msg = JSON.parse(msg);
                if (msg.type == constants.REMOTE_ACK) {
                    console.log(`recieved identity : ${msg.user}@${rinfo.address}`);
                    // add remote to registry
                    global.REGISTRY.AddRemote(msg.user, rinfo.address);
                }
                if (msg.type == constants.REMOTE_REQUEST) {
                    // send own data
                    console.log(`sending identity to ${msg.user}@${rinfo.address}`);
                    this.sendIdentity(id, rinfo.address, this.server.port);
                }
            });
            // send broadast on network
            const bcaddr = "192.168.0.255";
            this.sendReq(id, bcaddr, this.server.port);
        }
        catch (err) {
            throw err;
        }
    }

    Stop() {
        try {
            this.server.self.close(() => {
                console.log(`stopped discovery server`);
            });
        }
        catch(err) {
            throw err;
        }
    }

    sendReq(id, address, port) {
        try {
            const client = dgram.createSocket("udp4");
            client.on('listening', function () {
                client.setBroadcast(true);
            });

            const message = {
                type: constants.REMOTE_REQUEST,
                user: id
            };
            const data = JSON.stringify(message);

            console.log(`sending ${constants.REMOTE_REQUEST} on ${address}:${port}`);
            client.send(data, 0, data.length, port, address);
        }
        catch (err) {
            throw err;
        }
    }

    sendIdentity(id, address, port) {
        try {
            const client = dgram.createSocket("udp4");

            const message = {
                type: constants.REMOTE_ACK,
                user: id
            };
            const data = JSON.stringify(message);

            client.send(data, 0, data.length, port, address);
        }
        catch (err) {
            throw err;
        }
    }

    initServer(address, port) {
        try {
            if (typeof port != "number") {
                throw new Error(`Invalid port for discovery server: ${port}`);
            }

            // create udp4 based server
            const server = dgram.createSocket("udp4");
            server.on("listening", () => {
                console.log(`discovery server listening on ${server.address().address}:${server.address().port}`);
            });
            server.bind(port, address);

            return server;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = Discovery;