const net = require("net");

class Communication {
    constructor(_port) {
        this.server = {};
        this.server.port = _port;
        this.server.address = "0.0.0.0";
    }

    Start() {
        try {
            this.server.self = this.initServer(this.server.address, this.server.port);
        }
        catch (err) {
            throw err;
        }
    }

    initServer(address, port) {
        try {
            const server = net.createServer();
            server.on("listening", () => {
                console.log(`communication server listening on ${server.address().address}:${server.address().port}`);
            });
            server.listen(port, address);
            return server;
        }
        catch (err) {
            throw err;
        }
    }
}