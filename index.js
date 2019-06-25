/* eslint-disable no-console */
const { send } = require("micro");
const { applyMiddleware } = require("micro-middleware");
const { withNamespace, router, get, put, del } = require("microrouter");
const compress = require("micro-compress");
const handler = require("serve-handler");
const parser = require("form-parser");
const rrdir = require("rrdir");
const fs = require("fs-extra");
const path = require("path");

const TABLE = {
  "Информатика и вычислительная техника (09.03.01)": {
    headers: [
      {
        text: "Абитуриенты",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Русский язык", value: "rus" },
      { text: "Математика", value: "math" },
      { text: "Информатика", value: "inf" },
      { text: "Сумма баллов", value: "sum" },
      { text: "Оригинал", value: "original" }
    ],
    abiturs: [
      {
        name: "Аксонов Алексей Викторович",
        rus: 92,
        math: 70,
        inf: 62,
        sum: 224,
        original: "+"
      },
      {
        name: "Васнецов Иван Андреевич",
        rus: 100,
        math: 60,
        inf: 72,
        sum: 232,
        original: "-"
      }
    ]
  },
  "Прикладные математика и физика (03.03.01)": {
    headers: [
      {
        text: "Абитуриенты",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Русский язык", value: "rus" },
      { text: "Математика", value: "math" },
      { text: "Физика", value: "phys" },
      { text: "Сумма баллов", value: "sum" },
      { text: "Оригинал", value: "original" }
    ],
    abiturs: [
      {
        name: "Махдуми Азам",
        rus: 70,
        math: 98,
        phys: 90,
        sum: 258,
        original: "+"
      },
      {
        name: "Клинтски Радко Алексеевич",
        rus: 72,
        math: 86,
        phys: 82,
        sum: 240,
        original: "+"
      }
    ]
  }
};

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
  send(res, 200, Object.keys(TABLE));
}

function getTable(req, res) {
  send(res, 200, TABLE[req.query.spec] || { headers: [], abiturs: [] });
}

async function addDocs(req, res) {
  let requestFormData = [];
  await parser(req, async field => {
    requestFormData.push(field);
  });

  let filesAreInvalid = requestFormData
    .filter(obj => obj.fieldType === "file" && obj.fieldName === "files")
    .some(
      file =>
        !["image/png", "image/jpeg", "application/pdf"].includes(
          file.fieldContent.fileType
        )
    );

  if (filesAreInvalid) {
    send(res, 400, "INVALID_FILES");
    return;
  }

  let spec = requestFormData.filter(
    obj => obj.fieldType === "text" && obj.fieldName === "spec"
  )[0].fieldContent;

  let fullname = requestFormData.filter(
    obj => obj.fieldType === "text" && obj.fieldName === "name"
  )[0].fieldContent;

  let email = requestFormData.filter(
    obj => obj.fieldType === "text" && obj.fieldName === "email"
  )[0].fieldContent;

  let docsPath = path.join(
    path.resolve(),
    "documents",
    spec,
    `${fullname} (${req.params.uuid})`
  );

  fs.ensureDir(docsPath)
    .then(() => {
      requestFormData
        .filter(obj => obj.fieldType === "file")
        .forEach(async file => {
          file.fieldContent.fileStream.pipe(
            fs.createWriteStream(
              path.join(docsPath, file.fieldContent.fileName)
            )
          );
        });
    })
    .then(() => {
      fs.ensureFile(path.join(docsPath, "email.txt")).then(() => {
        fs.writeFile(path.join(docsPath, "email.txt"), email);
      });
    });

  send(res, 200, "OK");
}

async function removeDocs(req, res) {
  for await (const entry of rrdir.stream(
    path.join(path.resolve(), "documents")
  )) {
    if (entry.directory && entry.path.includes(req.params.uuid)) {
      fs.emptyDir(entry.path).then(() => {
        fs.remove(entry.path);
      });

      let spec = path.basename(path.dirname(entry.path));
      let fullname = path
        .basename(entry.path)
        .replace(` (${req.params.uuid})`, "");

      TABLE[spec].abiturs = TABLE[spec].abiturs.filter(
        abitur => abitur.name !== fullname
      );

      break;
    }
  }

  send(res, 200, "OK");
}

module.exports = applyMiddleware(
  router(
    withNamespace("/api")(
      get("/getSpecialities", getSpecialities),
      get("/getTable", getTable),
      put("/addDocs/:uuid", addDocs),
      del("/removeDocs/:uuid", removeDocs)
    ),
    get("/*", vueServe)
  ),
  [compress]
);
