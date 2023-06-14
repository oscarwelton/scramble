import fetch from "node-fetch";

let wordList = {};
let wordLength = 4;

async function generateWord(length) {
  const response = await fetch(
    `https://random-word-api.vercel.app/api?words=1&length=${length}`,
    { method: "GET" }
  );
  const data = await response.json();
  const word = data[0];
  const regex = /^[a-zA-Z]+$/;
  if (regex.test(word)) {
    return word;
  } else {
    console.log(`Invalid word: ${word}`)
    return generateWord(length);
  }
}

async function fetchDefinitions(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const options = {
    method: "GET"
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const definitionString = result[0]['meanings'][0]['definitions'][0]['definition'];
    const partOfSpeech = result[0]['meanings'][0]['partOfSpeech'];
    const definition = `(${partOfSpeech}) ${definitionString}`
    return definition;
  } catch (error) {
    console.log(`Failed to fetch definitions for ${word}: ${error}`);
  }
}

async function addToObject() {

  const word = await generateWord(wordLength);
  const definition= await fetchDefinitions(word);
  if (!definition) {
    return addToObject();
  }
  wordList[word] = definition;
  wordLength++;
}

async function main() {
  while (Object.keys(wordList).length !== 5) {
    await addToObject();
  }
  console.log(wordList);
}

await main();

export { wordList };
