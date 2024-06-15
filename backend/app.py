import json
import random
from collections import defaultdict

from ai import OpenAIParser
from problems import problems
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from collections import defaultdict
import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
ai_parser = OpenAIParser()
games = {}
waiting_list = []
sidUsername = {}

class Game:
    def __init__(self, players):
        self.players = players
        self.scores = defaultdict(int)
        self.game_id = id(self)  # unique identifier for the game

    def add_score(self, player, score):
        self.scores[sidUsername[player]] += score
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
            send_question(player)
        return new_game
    return None

def send_question(player):
    question_index = random.randrange(len(problems))
    emit('new_question', {'question': {'question_id': question_index, 'question': problems[question_index]['problem']}}, room=player)

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

@socketio.on('register')
def handle_register(data):
    print('Handle registration:', request.sid)
    username = data['username']
    sidUsername[request.sid] = username

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

@socketio.on('receive_answer')
def handle_receive_score(data):
    try:
        game_id = data['game_id']
        question_id = data['question_id']
        answer = data['answer']
        if game_id in games and question_id < len(problems):
            result = ai_parser.evaluate_solution(answer, problems[question_id])
            print(result)
            if result and result['rating'] > 50:
                games[game_id].add_score(request.sid, 1)
        else:
            emit('error', {'message': 'Invalid game or question ID'})
    except Exception as e:
        print(f"Error handling the received answer: {e}")
        emit('error', {'message': 'Failed to process the answer'})
    send_question(request.sid)

if __name__ == '__main__':
    socketio.run(app, debug=True)
