# Import flask and datetime module for showing date and time
from flask import Flask, request 
from flask_cors import CORS, cross_origin
import sqlite3
import base64

  
# Initializing flask app
app = Flask(__name__)

def createTable(): 
    try:
        connection = sqlite3.connect('{}.db'.format("alphabet"))
        c = connection.cursor()
        c.execute("CREATE TABLE IF NOT EXISTS data(symbol TEXT PRIMARY KEY, uri TEXT)")
        connection.commit()
    except Exception as e: 
        print(str(e))
        pass

def updateData(symbol, data): 
    sql = """UPDATE data SET symbol = "{}", uri = "{}" WHERE symbol = "{}";""".format(symbol, data, symbol)
    try:
        connection = sqlite3.connect('{}.db'.format("alphabet"))
        c = connection.cursor()
        c.execute(sql)
        connection.commit()
    except Exception as e:
        print(str(e))
        pass
    
def insertData(symbol, data): 
    sql = """INSERT INTO data (symbol, uri) VALUES ("{}","{}");""".format(symbol, data)
    try:
        connection = sqlite3.connect('{}.db'.format("alphabet"))
        c = connection.cursor()
        c.execute(sql)
    except Exception as e:
        print(str(e))
        pass
    connection.commit()

def getData(symbol): 
    try:
        connection = sqlite3.connect('{}.db'.format("alphabet"))
        c = connection.cursor()
        sql = "SELECT uri FROM data WHERE parent_id = '{}' LIMIT 1".format(symbol)
        c.execute(sql)
        connection.commit()
        result = c.fetchone()
        if result is not None:
            return result[0]
        else: return False
    except Exception as e:
        print(str(e))
        return False

def cleanTable(): 
    try:     
        connection = sqlite3.connect('{}.db'.format("alphabet"))
        c = connection.cursor()
        c.execute("DELETE FROM data")
        connection.commit()
        c.execute("VACUUM")
        connection.commit()
    except Exception as e: 
        print(str(e)) 
        return False 

def checkExists(symbol): 
    try:
        connection = sqlite3.connect('{}.db'.format("alphabet"))
        c = connection.cursor()
        sql = "SELECT symbol FROM data WHERE symbol = '{}' LIMIT 1".format(symbol)
        c.execute(sql)
        connection.commit()
        result = c.fetchone()
        if result != None:
            return True
        else: return False
    except Exception as e:
        print(str(e))
        return False

# Route for seeing a data
@app.route('/index')
def index(): 
    return "routed to /index"

@app.route('/drawer', methods=['POST'])
@cross_origin()
def drawer(): 
    createTable()
    if request.method == "POST": 
        print("post") 
        data = request.json 
        path = "./img/alpha_{}.png".format(data['symbol'])
            
        if data['inputText'] == "clean": 
            cleanTable()
        else: 
            
            uri = data['inputText'][22:]
            
            if len(uri) % 4 != 0: 
                print("not multiple of 4")
                uri += '=' * (4 - len(uri) % 4)
                print(uri)
            
            with open(path, "wb") as fh:
                fh.write(base64.b64decode(uri))
        
            if checkExists(data['symbol']): 
                print("data exists")
                updateData(data['symbol'], uri)
            else: 
                print("data doesn't exist")
                insertData(data['symbol'], uri)
        return "ok"

# Running app
if __name__ == '__main__':
    app.run(debug = True)