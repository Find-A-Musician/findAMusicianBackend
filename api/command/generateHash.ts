import readline from 'readline';
import bcrypt from 'bcrypt';
import Logger from '../log/logger';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('What is your password ', function (password) {
  const saltRound = 10;
  bcrypt.hash(password, saltRound, async function (err, hash) {
    if (err) {
      Logger.error(`An error has occured when creating a hash \n ${err}`);
      rl.close();
    }
    Logger.info('-------------------HASH-----------------\n' + hash);
    rl.close();
  });
});
