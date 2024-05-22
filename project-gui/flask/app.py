from flask import Flask, jsonify, request, session, send_from_directory
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_socketio import SocketIO, emit

class AppConfig:
  CORS_HEADERS = 'Content-Type'
  
  SECRET_KEY = "secret neural network key"  
  SESSION_TYPE = "filesystem"

api = Flask(__name__)
api.config.from_object(AppConfig)
api.secret_key = AppConfig.SECRET_KEY

# Set up CORS with specific origins and allow credentials
CORS(api, supports_credentials=True, origins=["http://localhost:3000"])
app_session = Session(api)
socket_io = SocketIO(api, cors_allowed_origins = "http://localhost:3000")

@api.route('/', methods=['GET'])
def getPredictions():
  
  return jsonify({
    "message": "Test"
  })
  
if __name__ == '__main__':
    api.run(debug=True)
    socket_io.run(api, debug=True, port=5000)