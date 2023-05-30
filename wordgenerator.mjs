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
  // console.log(word)
  return regex.test(word) ? word : generateWord(length);
}

async function fetchDefinitions(word) {
  const url = `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "9bb9f93489msh6ae53331cd38f0ep172884jsn56ba60a74f0c",
      "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result.definitions && result.definitions.length > 0) {
      return result.definitions[0];
    } else {
      return fetchDefinitions(word);
    }
  } catch (error) {
    return fetchDefinitions(word);
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
}

async function main() {
  await runScheduledTask();
  await fetchDefinitions();
  console.log(wordList);
  const words = Object.keys(wordList);
  const values =  Object.values(wordList);
  // console.log(words.length, values.length)
  if (words.length != 5 && values.length != 5 ) {
    main()
  }
}

main();

export { wordList }
