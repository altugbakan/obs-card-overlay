from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/control")
def control():
    return render_template("control.html")

@app.route("/overlay")
def overlay():
    return render_template("overlay.html")

@socketio.on("set_card")
def handle_set_card(data):
    name = data.get("name", "").strip()
    url = data.get("url")
    if name and url:
        emit("show_card", {"name": name, "url": url}, broadcast=True)
        print(f"Broadcasted card: {name} -> {url}")

if __name__ == "__main__":
    print("Starting Flask + SocketIO server on port http://localhost:5000")
    socketio.run(app, host="0.0.0.0", port=5000)
