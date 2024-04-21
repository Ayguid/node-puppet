require('dotenv').config(); // env config
const path = require('path');
const MTProto = require('@mtproto/core');
const { sleep } = require('@mtproto/core/src/utils/common');
const { saveData } = require('./fileManager.js');

class API {
  constructor() {
    this.mtproto = new MTProto({
      api_id: Number(process.env.TELEGRAM_API_ID) || '',
      api_hash: process.env.TELEGRAM_API_HASH || '',
      storageOptions: {
        path: path.resolve(__dirname, './data/1.json'),
      },
    });
  }

  async call(method, params, options = {}) {
    try {
      const result = await this.mtproto.call(method, params, options);

      return result;
    } catch (error) {
      console.log(`${method} error:`, error);

      const { error_code, error_message } = error;

      if (error_code === 420) {
        const seconds = Number(error_message.split('FLOOD_WAIT_')[1]);
        const ms = seconds * 1000;

        await sleep(ms);

        return this.call(method, params, options);
      }

      if (error_code === 303) {
        const [type, dcIdAsString] = error_message.split('_MIGRATE_');

        const dcId = Number(dcIdAsString);

        // If auth.sendCode call on incorrect DC need change default DC, because
        // call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
        if (type === 'PHONE') {
          await this.mtproto.setDefaultDc(dcId);
        } else {
          Object.assign(options, { dcId });
        }

        return this.call(method, params, options);
      }

      return Promise.reject(error);
    }
  }
}

const api = new API();

async function getUser() {
    try {
      const user = await api.call('users.getFullUser', {
        id: {
          _: 'inputUserSelf',
        },
      });
  
      return user;
    } catch (error) {
      return null;
    }
  }
  
  function sendCode(phone) {
    return api.call('auth.sendCode', {
      phone_number: phone,
      settings: {
        _: 'codeSettings',
      },
    });
  }
  
  function signIn({ code, phone, phone_code_hash }) {
    return api.call('auth.signIn', {
      phone_code: code,
      phone_number: phone,
      phone_code_hash: phone_code_hash,
    });
  }
  
  function signUp({ phone, phone_code_hash }) {
    return api.call('auth.signUp', {
      phone_number: phone,
      phone_code_hash: phone_code_hash,
      first_name: 'MTProto',
      last_name: 'Core',
    });
  }
  
  function getPassword() {
    return api.call('account.getPassword');
  }
  
  function checkPassword({ srp_id, A, M1 }) {
    return api.call('auth.checkPassword', {
      password: {
        _: 'inputCheckPasswordSRP',
        srp_id,
        A,
        M1,
      },
    });
  }
  
  (async () => {
      const user = await getUser();
    
      const phone = '+541160302964';
      const code = '23251';
    
      if (!user) {
        const { phone_code_hash } = await sendCode(phone);
    
        try {
          const signInResult = await signIn({
            code,
            phone,
            phone_code_hash,
          });
    
          if (signInResult._ === 'auth.authorizationSignUpRequired') {
            await signUp({
              phone,
              phone_code_hash,
            });
          }
        } catch (error) {
          if (error.error_message !== 'SESSION_PASSWORD_NEEDED') {
            console.log(`error:`, error);
    
            return;
          }
    
          // 2FA
    
          const password = 'USER_PASSWORD';
    
          const { srp_id, current_algo, srp_B } = await getPassword();
          const { g, p, salt1, salt2 } = current_algo;
    
          const { A, M1 } = await api.mtproto.crypto.getSRPParams({
            g,
            p,
            salt1,
            salt2,
            gB: srp_B,
            password,
          });
    
          const checkPasswordResult = await checkPassword({ srp_id, A, M1 });
        }
      }
    })();

    (async () => {
        const resolvedPeer = await api.call('contacts.resolveUsername', {
          username: 'mtproto_core',
        });
      
        const channel = resolvedPeer.chats.find(
          (chat) => chat.id === resolvedPeer.peer.channel_id
        );
      
        const inputPeer = {
          _: 'inputPeerChannel',
          channel_id: channel.id,
          access_hash: channel.access_hash,
        };
      
        const LIMIT_COUNT = 10;
        const allMessages = [];
      
        const firstHistoryResult = await api.call('messages.getHistory', {
          peer: inputPeer,
          limit: LIMIT_COUNT,
        });
      
        const historyCount = firstHistoryResult.count;
      
        for (let offset = 0; offset < historyCount; offset += LIMIT_COUNT) {
          const history = await api.call('messages.getHistory', {
            peer: inputPeer,
            add_offset: offset,
            limit: LIMIT_COUNT,
          });
          
          allMessages.push(...history.messages);
        }
      
        console.log('allMessages:', allMessages);
        await saveData(allMessages, 'allMessages.json'); // only if x condition save data
      })();

      /*
      (async () =>{

        const file = await api.call('upload.getFile', { file_id: '5422727534023389187'});

        console.log(file);

      })();
*/

module.exports = api;
