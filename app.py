import os
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

STATS_FILE = "stats.json"

if not os.path.exists(STATS_FILE):
    with open(STATS_FILE, "w") as f:
        json.dump({"yes": 0, "no": 0, "history": []}, f)


def load_stats():
    with open(STATS_FILE, "r") as f:
        return json.load(f)


def save_stats(data):
    with open(STATS_FILE, "w") as f:
        json.dump(data, f, indent=4)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/choice", methods=["POST"])
def choice():
    data = request.json
    ch = data.get("choice")

    stats = load_stats()

    if ch == "yes":
        stats["yes"] += 1
    elif ch == "no":
        stats["no"] += 1

    stats["history"].append({
        "choice": ch,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    save_stats(stats)
    return jsonify({"success": True})


@app.route("/stats")
def stats():
    return jsonify(load_stats())


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
