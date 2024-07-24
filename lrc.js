
function playLyrics(lines, charDelays, lineDelays) {
  let currentLine = 0;

  function displayLine() {
    if (currentLine >= lines.length) {
      return;
    }

    const line = lines[currentLine];
    const delay = lineDelays[currentLine];

    let charIndex = 0;

    function displayChar() {
      if (charIndex < line.length) {
        process.stdout.write(line[charIndex]);
        charIndex++;
        setTimeout(displayChar, charDelays[currentLine]);
      } else {
        currentLine++;
        if (currentLine < lines.length) {
          console.log(); 
        }
        setTimeout(displayLine, delay);
      }
    }

    setTimeout(displayChar, delay);
  }

  displayLine();
}


const lyrics = [
  "Người lấy đi người lấy đi rồi đánh rơi",
  "Một người yêu !!!",
  "Là la la la lá",
  "Là la la la lá la là",
  "A á ớ bờ cờ anh yêu em quá mức dại khờ <3",
  "Là la la la lá",
  "Là la la la lá lá la",
  "Người rành bảng chữ cái khi gặp em anh chỉ biết ơ",
  "Là la la la lá",
  "Là la la la lá la là",
  "Anh thâm tâm tuy ốm nhưng tâm trí cứ mập mờ",
  "Là la la la lá",
  "Là la la la lá lá la",
  "Mờ ơ mơ hỏi mở lòng anh đón một nàng thơ",
  "                       ",
];

const charDelays = [45, 60, 70, 70, 60, 60, 60, 40, 60, 60, 40, 60, 60, 60, 100000]; 
const lineDelays = [0, 1400, 700, 100, 200, 150, 400, 400, 250, 300, 500, 500, 250, 250, 0]; 

playLyrics(lyrics, charDelays, lineDelays);
