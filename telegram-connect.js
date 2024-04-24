import dotenv from 'dotenv'
dotenv.config();
//https://core.telegram.org/methods
//https://gram.js.org/tl/messages/GetHistory
//https://gram.js.org/beta/classes/TelegramClient.html#downloadMedia
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import readline from "readline";
import * as fs from 'fs';

const apiId = Number(process.env.TELEGRAM_API_ID) || '';
const apiHash = process.env.TELEGRAM_API_HASH || '';
const stringSession = new StringSession("1AQAOMTQ5LjE1NC4xNzUuNTMBuyk8EU0y6o+lEpCJ45tVGJoafppm1FZmFQxkuH4JdGzQ2Qzz6UyMZOu7ZsCa2FxFt0l/e+UJKCO2zynZfwKdQC0GfSfC1E9PfVf0tNbA+h3E2CCHts3obAgLchnGjuFi1guARk/Q9Q6oylRrxxmOTdVCsyEdxGm1MG6+vvDIlp3NUOxrQWAZk68l+/LpJbpFqxeuJAEofsf333pUWMcGchB6nMOkxFewroozPUFZAaSXdh+XpqKj+O5vwgLnaYBUHnEz5b4l95hv0LuixCn5Rufiu7Jb/20gA3d+yqMz50KMCEWHL4bzuwU4qZs95zn1coFDhGj78YfrTZmwUeWRuZs="); // fill this later with the value from session.save()
const client = new TelegramClient(stringSession, apiId, apiHash, {});

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


(async () => {
  await client.connect();
  const user = "https://t.me/binancekillers";
  const messages = await client.getMessages(user, { limit: 100, filter: Api.InputMessagesFilterPhotos });
  const ROOT_DB_DIR = './db';
  const userFolder = ROOT_DB_DIR + '/' + user.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  let chatsArray = [];
  console.log(messages);
  messages.forEach(async msg => {
    const photo = msg.photo;
    let message = {
      id: msg.id,
      message: msg.message,
      //media: msg.media,
      //img: `${photo.accessHash}.jpg`
    }
    chatsArray.push(message);
    const buffer = await client.downloadMedia(msg, {
      //progressCallback : console.log
    });
    

    if (!fs.existsSync(userFolder)){
      await fs.mkdirSync(userFolder);
    } 
    fs.writeFileSync(`./${userFolder}/${msg.id}.jpg`, buffer);
  });
  fs.writeFileSync(`./${userFolder}/chats.json`, JSON.stringify(chatsArray));
  //await client.disconnect();
})();



/*
(async () => {
  await client.connect();
  const messages = await client.getMessages("https://t.me/binancekillers", { limit: 100, filter: Api.InputMessagesFilterPhotos })
  console.log(messages);
  let emptyJson = [];
  messages.forEach(async msg => {
    const photo = msg.photo;
    let message = {
      //media: msg.media,
      message: msg.message,
      img: `${photo.accessHash}.jpg`
    }
    emptyJson.push(message);
    const buffer = await client.downloadFile(
      new Api.InputPhotoFileLocation({
        id: photo.id,
        accessHash: photo.accessHash,
        fileReference: photo.fileReference,
        thumbSize: "i"
      }),
      {
        dcId: photo.dcId,
        //fileSize: "m",
      }
    );
    fs.writeFileSync('./chats.json', JSON.stringify(emptyJson));
    fs.writeFileSync(`./pics/${msg.media.photo.accessHash}.jpg`, buffer);
  })
  // Get all the photos
  //const photos = await client.getMessages(chat, {limit: undefined, filter:Api.InputMessagesFilterPhotos})

  // Get messages by ID:
  //const messages = await client.getMessages("https://t.me/binancekillers", {ids:1337})
  //const message_1337 = messages[0];

})()
*/






/*
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
*/
/*
(async function run() {
  await client.connect(); // This assumes you have already authenticated with .start()

  const result = await client.invoke(
    new Api.channels.GetFullChannel({
      channel: "https://t.me/binancekillers",
    })
  );
  console.log(result); // prints the result
})();
*/
/*
(async function run() {
  await client.connect(); // This assumes you have already authenticated with .start()

  const result = await client.invoke(
    new Api.messages.GetHistory({
      peer: "https://t.me/binancekillers",
      offsetId: 43,
      offsetDate: 43,
      addOffset: 0,
      limit: 100,
      maxId: 0,
      minId: 0,
      hash: BigInt("-4156887774564"),
      //filter:Api.InputMessagesFilterPhotos}
    })
  );
  //fs.writeFileSync('./chats.json', JSON.stringify(result));
  let msgsWithMedia = result.messages.filter(msg => msg.media);
  let emptyJson = []
  //console.log(msgsWithMedia); // prints the result
  msgsWithMedia.forEach(async msg => {
  console.log(msg.media.photo);
    
    const buffer = await client.downloadFile(
      new Api.InputPhotoFileLocation({
          id: msg.media.photo.id,
          accessHash: msg.media.photo.accessHash,
          //fileReference: Buffer.from((Object.values(msg.media.photo.fileReference))),
          fileReference: Buffer.from((msg.media.photo.fileReference)),
          thumbSize: "i"
      }),
      {
          dcId: msg.media.photo.dcId,
          //fileSize: "y",
      }
  );
  fs.writeFileSync('./chats.json', JSON.stringify(emptyJson));
  fs.writeFileSync(`./pics/${msg.media.photo.accessHash}.jpg`, buffer);
    let message = {
      //media: msg.media,
      message: msg.message,
      img: `${msg.media.photo.accessHash}.jpg`
    }
    emptyJson.push(message)
  });
})();*/