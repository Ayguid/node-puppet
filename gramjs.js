import dotenv from 'dotenv'
dotenv.config()

import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import readline from "readline";
import * as fs from 'fs';

const apiId = Number(process.env.TELEGRAM_API_ID) || '';
const apiHash = process.env.TELEGRAM_API_HASH || '';
const stringSession = new StringSession("1AQAOMTQ5LjE1NC4xNzUuNTMBuyk8EU0y6o+lEpCJ45tVGJoafppm1FZmFQxkuH4JdGzQ2Qzz6UyMZOu7ZsCa2FxFt0l/e+UJKCO2zynZfwKdQC0GfSfC1E9PfVf0tNbA+h3E2CCHts3obAgLchnGjuFi1guARk/Q9Q6oylRrxxmOTdVCsyEdxGm1MG6+vvDIlp3NUOxrQWAZk68l+/LpJbpFqxeuJAEofsf333pUWMcGchB6nMOkxFewroozPUFZAaSXdh+XpqKj+O5vwgLnaYBUHnEz5b4l95hv0LuixCn5Rufiu7Jb/20gA3d+yqMz50KMCEWHL4bzuwU4qZs95zn1coFDhGj78YfrTZmwUeWRuZs="); // fill this later with the value from session.save()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
/*
(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your number: ", resolve)
      ),
    password: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your password: ", resolve)
      ),
    phoneCode: async () =>
      new Promise((resolve) =>
        rl.question("Please enter the code you received: ", resolve)
      ),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again
  await client.sendMessage("me", { message: "Hello!" });
})();
*/


const client = new TelegramClient(stringSession, apiId, apiHash, {});

(async function run() {

  let photo = {
    id: "5321498264412991213",
    accessHash: "4667075412073613100",
    fileReference: {
      "0": 2,
      "1": 74,
      "2": 241,
      "3": 132,
      "4": 71,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 25,
      "9": 102,
      "10": 37,
      "11": 116,
      "12": 128,
      "13": 114,
      "14": 50,
      "15": 135,
      "16": 168,
      "17": 66,
      "18": 28,
      "19": 148,
      "20": 126,
      "21": 176,
      "22": 160,
      "23": 183,
      "24": 91,
      "25": 34,
      "26": 67,
      "27": 183,
      "28": 152
  },
    dcId: 2
  }

  await client.connect(); // This assumes you have already authenticated with .start()

  const buffer = await client.downloadFile(
    new Api.InputPhotoFileLocation({
        id: photo.id,
        accessHash: photo.accessHash,
        fileReference: Buffer.from((Object.values(photo.fileReference))),
        thumbSize: "i"
    }),
    {
        dcId: photo.dcId,
        //fileSize: "y",
    }
);
  fs.writeFileSync('./pics/output.jpg', buffer);
  console.log(buffer); // prints the result
})();