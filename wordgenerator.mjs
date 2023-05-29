import fetch from "node-fetch";

let wordList = [];

async function generateWord(length) {
  const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${length}`, {
    method: "GET",
  });
  const data = await response.json();
  const word = data[0];
  const regex = /^[a-zA-Z]+$/;
  return regex.test(word) ? word : generateWord(length);
}

async function addToObject() {
  const one = await generateWord(4);
  wordList.push(one);
  const two = await generateWord(5);
  wordList.push(two);
  const three = await generateWord(6);
  wordList.push(three);
  const four = await generateWord(7);
  wordList.push(four);
  const five = await generateWord(8);
  wordList.push(five);
}

async function runScheduledTask() {
  const times = 1;
  for (let i = 0; i < times; i++) {
    await addToObject();
  }
  return wordList;
}

(async () => {
  await runScheduledTask();
  console.log(wordList);
})();

export default wordList;
