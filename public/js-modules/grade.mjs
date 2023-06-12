function grades(scoreValue) {
  const grade = document.getElementById("grade");
  const gradeMessage = document.getElementById("grade-message");
  let emoji = ''

  switch (true) {
    case scoreValue >= 1875:
      grade.innerText = "A++";
      gradeMessage.innerText = "remarkable!";
      emoji = "🥸";
      break;
    case scoreValue >= 1800 && scoreValue <= 1875:
      grade.innerText = "A";
      gradeMessage.innerText = "outstanding!";
      emoji = "🤓";
      break;
    case scoreValue >= 1700 && scoreValue <= 1799:
      grade.innerText = "A-";
      gradeMessage.innerText = "marvelous!";
      emoji = "😎";
      break;
    case scoreValue >= 1600 && scoreValue <= 1699:
      grade.innerText = "B+";
      gradeMessage.innerText = "brilliant!";
      emoji = "😇";
      break;
    case scoreValue >= 1500 && scoreValue <= 1599:
      grade.innerText = "B";
      gradeMessage.innerText = "impressive!";
      emoji = "😆";
      break;
    case scoreValue >= 1400 && scoreValue <= 1499:
      grade.innerText = "B-";
      gradeMessage.innerText = "encouraging!";
      emoji = "😃";
      break;
    case scoreValue >= 1300 && scoreValue <= 1399:
      grade.innerText = "C+";
      gradeMessage.innerText = "promising!";
      emoji = "😊";
      break;
    case scoreValue >= 1200 && scoreValue <= 1299:
      grade.innerText = "C";
      gradeMessage.innerText = "satisfactory";
      emoji = "🙂";
      break;
    case scoreValue >= 1100 && scoreValue <= 1199:
      grade.innerText = "C-";
      gradeMessage.innerText = "so-so";
      emoji = "🤔";
      break;
    case scoreValue >= 1000 && scoreValue <= 1099:
      grade.innerText = "D+";
      gradeMessage.innerText = "hmm...";
      emoji = "😐";
      break;
    case scoreValue >= 900 && scoreValue <= 999:
      grade.innerText = "D";
      gradeMessage.innerText = "substandard";
      emoji = "🫢";
      break;
    case scoreValue >= 800 && scoreValue <= 899:
      grade.innerText = "D-";
      gradeMessage.innerText = "poor";
      emoji = "🥲";
      break;
    case scoreValue >= 700 && scoreValue <= 799:
      grade.innerText = "E+";
      gradeMessage.innerText = "not good";
      emoji = "☹️";
      break;
    case scoreValue >= 600 && scoreValue <= 699:
      grade.innerText = "E";
      gradeMessage.innerText = "just bad";
      emoji = "😰";
      break;
    case scoreValue >= 400 && scoreValue <= 599:
      grade.innerText = "E-";
      gradeMessage.innerText = "really?";
      emoji = "😵";
      break;
    case scoreValue >= 0 && scoreValue <= 399:
      grade.innerText = "F";
      gradeMessage.innerText = "fail!";
      emoji = "🤬";
      break;
    default:
      grade.innerText = "Invalid score value";
      break;
  }
  return { grade: grade.innerText, gradeMessage: gradeMessage.innerText, emoji };
}

export { grades }
