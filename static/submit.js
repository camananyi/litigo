let currentIndex = 0;
const words = window.words;

const cardInner = document.getElementById("cardInner");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const actionBtn = document.getElementById("actionBtn");
const textarea = document.querySelector("textarea");

function showWord() {
    const wordObj = words[currentIndex];

    document.querySelector(".word").textContent = wordObj.word;
    document.querySelector(".part").textContent = wordObj.partofspeech;
    document.querySelector(".definition").textContent = wordObj.definition;
    document.querySelector(".example").textContent = wordObj.example;

    textarea.value = "";
}

document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    const sentence = textarea.value;

    const response = await fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sentence: sentence,
            word: words[currentIndex]
        })
    });

    const result = await response.json();

    if (result.message === "Sentence too short") {

        resultTitle.textContent = "Too Short";
        resultMessage.textContent = "The sentence was too short to show understanding. Write a longer sentence and try again.";

        actionBtn.textContent = "Try Again";
        cardInner.classList.add("flipped");

    } else if (result.message === "Wrong") {

        resultTitle.textContent = "Not Quite";
        resultMessage.textContent = "The word was used incorrectly. Re-read the definition and example sentence, then try again";

        actionBtn.textContent = "Try Again";
        cardInner.classList.add("flipped");

    } else if (result.message === "Used Correctly!") {

        resultTitle.textContent = "Great Job!";
        resultMessage.textContent = "Correct! The word has been added to your quiz list. Moving to next word.";

        actionBtn.textContent = "Next";
        cardInner.classList.add("flipped");
    }
});

actionBtn.addEventListener("click", () => {

    if (actionBtn.textContent === "Try Again") {
        cardInner.classList.remove("flipped");
        return;
    }

    if (actionBtn.textContent === "Next") {

        currentIndex++;

        if (currentIndex >= words.length) {
            resultTitle.textContent = "Done!";
            resultMessage.textContent = "See you tomorrow";
            actionBtn.textContent = "Restart";
            return;
        }

        showWord();
        cardInner.classList.remove("flipped");
    }

    if (actionBtn.textContent === "Restart") {
        location.reload();
    }
});

// initial load
showWord();