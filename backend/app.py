from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from collections import defaultdict
import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
games = {}
waiting_list = []

class Game:
    def __init__(self, players):
        self.players = players
        self.scores = defaultdict(int)
        self.game_id = id(self)  # unique identifier for the game

    def add_score(self, player, score):
        self.scores[player] += score
        self.broadcast_scores()

    def broadcast_scores(self):
        for player in self.players:
            emit('score_update', {'scores': self.scores}, room=player)

def create_game():
    if len(waiting_list) >= 2:
        # Start a new game with the first two players in the waiting list
        new_game = Game(players=waiting_list[:2])
        games[new_game.game_id] = new_game
        for player in new_game.players:
            join_room(player)
            waiting_list.remove(player)
            emit('game_started', {'game_id': new_game.game_id}, room=player)
        return new_game
    return None


# REST API Route
@app.route('/signup', methods=['POST'])
def manage_data():
    if request.method == 'POST':
        data = request.json
        # TODO: Store user in mongodb
        return jsonify({'status': 'Data received', 'yourData': data}), 200
    else:
        data = {'message': 'Send some data!'}
        return jsonify(data), 200

@socketio.on('connect')
def handle_connect():
    print('User connected:', request.sid)
    waiting_list.append(request.sid)
    create_game()

@socketio.on('disconnect')
def handle_disconnect():
    print('User disconnected:', request.sid)
    waiting_list.remove(request.sid)
    for game_id, game in list(games.items()):
        if request.sid in game.players:
            leave_room(request.sid)
            game.players.remove(request.sid)
            if not game.players:
                del games[game_id]  # Remove game if no players left

@socketio.on('send_score')
def handle_send_score(data):
    print("send score received")
    score = data['score']
    game_id = data['game_id']
    if game_id in games:
        print("emitting to ", game_id)
        games[game_id].add_score(request.sid, score)

if __name__ == '__main__':
    socketio.run(app, debug=True)
