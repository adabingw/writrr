# Import flask and datetime module for showing date and time
from flask import Flask, request 
from flask_cors import CORS

  
# Initializing flask app
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# CORS(app)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

# Route for seeing a data
@app.route('/index')
def index(): 
    return "watatata"

@app.route('/drawer', methods=['POST'])
def drawer(): 
    if request.method == "POST": 
        print("post") 
        print(request)
        # data = request.form 
        # print(data)
        return 0 

# Running app
if __name__ == '__main__':
    app.run(debug = True)