from flask import Flask, render_template, request, jsonify
import csv
from datetime import date

app = Flask(__name__)

def load_words():
    words = []

    with open("vocab.csv", newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            words.append(row)

    return words

def get_start_index(all_words):
    today = date.today()
    day_number = today.timetuple().tm_yday
    return ((day_number - 1) * 5) % len(all_words)

# fix this so its actually a set of new words every time
def get_daily_words(all_words):
    start = get_start_index(all_words)
    return [all_words[(start + i) % len(all_words)] for i in range(5)]

@app.route("/")
def index():
    all_words = load_words()
    daily_words = get_daily_words(all_words)
    return render_template("index.html", words=daily_words)

@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()
    sentence = data["sentence"]
    word = data["word"]

    word_text = word["word"]
    word_count = len(sentence.strip().split())

    # need to add a not in sntence
    if word_count < 5:
        return jsonify({"message": "Sentence too short"})
    elif word_text.lower() in sentence.lower():
        return jsonify({"message": "Used Correctly!"})
    else:
        return jsonify({"message": "Wrong"})

if __name__ == "__main__":
    app.run(debug=True)