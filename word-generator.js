import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';

const wordList = {};

function generateWord(minLength, maxLength) {
  const word = faker.word.sample({
    length: { min: minLength, max: maxLength },
    strategy: "fail",
  });
  const regex = /^[a-zA-Z]+$/;
  return regex.test(word) ? word : generateWord(minLength, maxLength);
}

function addToObject(index) {
  const one = generateWord(4, 4);
  const two = generateWord(5, 5);
  const three = generateWord(5, 5);
  const four = generateWord(6, 6);
  const five = generateWord(7, 8);

  const result = { one, two, three, four, five };

  wordList[index] = result;
}

const times = 2;
for (let i = 0; i < times; i++) {
  addToObject(i);
}

console.log(wordList);

fetch('https://api.jsonbin.io/v3/b/646e287db89b1e2299a40326', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Master-Key': '$2b$10$8RTwTXIW08NAev7bHuiPd.MUJff7.e3zn3StonuOdR2tnE1dYrbG2',
  },
  body: JSON.stringify(wordList),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
