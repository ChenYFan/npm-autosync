import fs from "fs"
//不存在./data则创建
if (!fs.existsSync("./data")) fs.mkdirSync("./data")
//不存在./data/npm则创建
if (!fs.existsSync("./data/npm")) fs.mkdirSync("./data/npm")
