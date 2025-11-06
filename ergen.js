import fs from "fs";
import { parse } from "mongodb-schema";
import { generate } from "erd-generator";

const schemaJSON = JSON.parse(fs.readFileSync("userSchema.json"));
const erd = generate(schemaJSON);
fs.writeFileSync("userSchema.erd", erd);
