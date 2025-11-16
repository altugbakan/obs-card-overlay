from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def home():
    print("Home page requested")
    return "<a href='/control'>Control</a> | <a href='/overlay'>Overlay</a>"

@app.route("/control")
def control():
    print("Control page requested")
    return render_template("control.html")

@app.route("/overlay")
def overlay():
    print("Overlay page requested")
    return render_template("overlay.html")


@socketio.on("connect")
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on("disconnect")
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")

@socketio.on("set_card")
def handle_set_card(data):
    card_name = data.get("name", "").strip()
    print(f"Received set_card event: {card_name}")
    if card_name:
        emit("show_card", {"name": card_name}, broadcast=True)
        print(f"Broadcasted card name: {card_name}")


if __name__ == "__main__":
    print("Starting Flask + SocketIO server on port 5000")
    socketio.run(app, host="0.0.0.0", port=5000)
