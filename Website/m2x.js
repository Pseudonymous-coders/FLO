console.log("did m2x.js");
define(["charts", "client", "collections", "devices", "distributions", "jobs", "keys"],
function(Charts, Client, Collections, Devices, Distributions, Jobs, Keys) {
  console.log("M2X should work!");
    var M2X = function(apiKey, apiBase) {
      console.log("Got to M2X initialization");
        this.client = new Client(apiKey, apiBase);

        this.charts = new Charts(this.client);
        this.collections = new Collections(this.client, this.keys);
        this.devices = new Devices(this.client, this.keys);
        this.distributions = new Distributions(this.client);
        this.jobs = new Jobs(this.client);
        this.keys = new Keys(this.client);
    };

    M2X.prototype.status = function(callback, errorCallback) {
        return this.client.get("/status", callback, errorCallback);
    };
    console.log(M2X);
    return M2X;
});
