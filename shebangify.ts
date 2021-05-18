const fs = require("fs");
const path = require("path");

const filePath = path.resolve("./dist/index.js");
let data = "#!/usr/bin/env node\n\n";
data += fs.readFileSync(filePath);
fs.writeFileSync(filePath, data);
