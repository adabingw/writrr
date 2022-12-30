# Import flask and datetime module for showing date and time
from flask import Flask
from flask_cors import CORS
  
# Initializing flask app
app = Flask(__name__)
CORS(app)
  
# Route for seeing a data
@app.route('/index')

def index(): 
    return "watatata"

# Running app
if __name__ == '__main__':
    app.run(debug = True)