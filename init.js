import fs from "fs"
if (!fs.existsSync("./data")) fs.mkdirSync("./data")
if (!fs.existsSync("./data/npm")) fs.mkdirSync("./data/npm")
