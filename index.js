/* eslint-disable no-console */
const { send } = require("micro");
const { applyMiddleware } = require("micro-middleware");
const { withNamespace, router, get, post, del } = require("microrouter");
const compress = require("micro-compress");
const handler = require("serve-handler");
const parser = require("form-parser");

async function vueServe(req, res) {
  await handler(req, res, {
    public: "./dist/",
    directoryListing: false,
    rewrites: [
      {
        source: "/",
        destination: "/index.html"
      }
    ],
    headers: [
      {
        source: "*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Download-Options", value: "noopen" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Xss-Protection", value: "1; mode=block" }
        ]
      }
    ]
  });
}

function getSpecialities(req, res) {
  send(res, 200, {});
}

function getTable(req, res) {
  console.log(req.query.id); // uuid parent folder is a speciality
  send(res, 200, {});
}

async function addDocs(req, res) {
  console.log(req.query.id);

  await parser(req, async field => {
    console.log(field);
  });

  send(res, 200, "OK");
}

function removeDocs(req) {
  console.log(req.query.id);
}

module.exports = applyMiddleware(
  router(
    withNamespace("/api")(
      get("/getSpecialities", getSpecialities),
      get("/getTable", getTable),
      post("/addDocs", addDocs),
      del("/removeDocs", removeDocs)
    ),
    get("/*", vueServe)
  ),
  [compress]
);
