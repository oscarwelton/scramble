import fetch from "node-fetch";

let wordList = {};

async function generateWord(length) {
  const response = await fetch(
    `https://random-word-api.vercel.app/api?words=1&length=${length}`,
    { method: "GET" }
  );
  const data = await response.json();
  const word = data[0];
  const regex = /^[a-zA-Z]+$/;
  return regex.test(word) ? word : generateWord(length);
}

async function fetchDefinitions(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const options = {
    method: "GET"
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const definition = result[0]['meanings'][0]['definitions'][0]['definition'];
    const partOfSpeech = result[0]['meanings'][0]['partOfSpeech'];
    const definitions = `(${partOfSpeech}) : ${definition}`
    return definitions;
  } catch (error) {
    console.log(error)
  }
}

async function addToObject() {
  const one = await generateWord(4);
  wordList[one] = await fetchDefinitions(one);
  const two = await generateWord(5);
  wordList[two] = await fetchDefinitions(two);
  const three = await generateWord(6);
  wordList[three] = await fetchDefinitions(three);
  const four = await generateWord(7);
  wordList[four] = await fetchDefinitions(four);
  const five = await generateWord(8);
  wordList[five] = await fetchDefinitions(five);
}

async function runScheduledTask() {
  const times = 1;
  for (let i = 0; i < times; i++) {
    await addToObject();
  }
  return wordList;
}

async function main() {
  await runScheduledTask();
  console.log(wordList);
}

main();

export { wordList };
