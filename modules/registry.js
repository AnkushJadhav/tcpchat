class Registry {
    constructor() {
        this.registry = [];
    }

    AddRemote(user, ip) {
        try {
            let data = {
                user: user,
                ip: ip
            };

            this.registry.push(data);
        }
        catch (err) {
            throw err;
        }
    }

    GetRegistry() {
        try {
            return this.registry;
        }
        catch(err) {
            throw err;
        }
    }
}

module.exports = Registry;