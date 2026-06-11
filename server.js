const http = require("http");
const handler = require("serve-handler");

const CANONICAL_HOST = "www.fix-tok.com";

const serveOptions = {
  public: ".",
  cleanUrls: false,
  directoryListing: false,
  rewrites: [
    { source: "/", destination: "/index.html" },
    { source: "/contact", destination: "/contact.html" },
  ],
};

const server = http.createServer((req, res) => {
  const host = (req.headers.host || "").split(":")[0].toLowerCase();

  if (host === "fix-tok.com") {
    const target = `https://${CANONICAL_HOST}${req.url || "/"}`;
    res.writeHead(301, { Location: target, "Cache-Control": "public, max-age=3600" });
    res.end();
    return;
  }

  return handler(req, res, serveOptions);
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
  console.log(`fixTokWeb listening on :${port} (canonical ${CANONICAL_HOST})`);
});
