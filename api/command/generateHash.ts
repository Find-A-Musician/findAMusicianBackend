import readline from 'readline';
import bcrypt from 'bcrypt';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('What is your password ', function (password) {
  const saltRound = 10;
  bcrypt.hash(password, saltRound, async function (err, hash) {
    if (err) {
      console.log('An error has occured...');
      rl.close();
    }
    console.log('-------------------HASH-----------------\n' + hash);
    rl.close();
  });
});
