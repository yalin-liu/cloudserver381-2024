const fs = require('fs').promises;

async function readFileAsync() {
  try {
    const data = await fs.readFile('input.txt');
    console.log(data.toString());
  } catch (err) {
    console.error(err);
  }
}

readFileAsync().then(() => {
  console.log('Program Ended');
});
