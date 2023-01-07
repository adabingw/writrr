# Import flask and datetime module for showing date and time
from flask import Flask, request 
from flask_cors import CORS, cross_origin
import sqlite3
import base64
import os 
import opencv 
import detect
  
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
        print("post in draw") 
        data = request.json 
        padding = 0
        if data['symbol'].isupper(): 
            padding = 0
        else:
            padding = 1
        
        path = "./img/{}{}.png".format(data['symbol'], padding)
            
        if data['inputText'] == "clean": 
            cleanTable()
            dir = "cv_img/"         
            for file in os.listdir(dir):                
                os.remove(file)
                
            dir = "img/"         
            for file in os.listdir(dir):                
                os.remove(file)

        else: 
            uri = data['inputText'][22:]
            
            if len(uri) % 4 != 0: 
                print("not multiple of 4")
                uri += '=' * (4 - len(uri) % 4)
                print(uri)
            
            with open(path, "wb") as fh:
                fh.write(base64.b64decode(uri))
                
            recognized = detect.pred(path)
            if recognized == data['symbol']: 
                print("successfully recognized") 
            else: 
                print("not successfully recognized")
        
            if checkExists(data['symbol']): 
                print("data exists")
                updateData(data['symbol'], uri)
            else: 
                print("data doesn't exist")
                insertData(data['symbol'], uri)
        return "ok"

@app.route('/writer', methods=['POST'])
@cross_origin()
def writer(): 
    if request.method == "POST": 
        print("post in write") 
        data = request.json 
        text = data['text'] 
        print(text)
        
        path = "../frontend/src/images/result.png"
        if(os.path.exists(path)):
            os.remove(path)
        
        dir = "cv_img/"
        for file in os.listdir(dir):       
            path = os.path.join(dir, file)         
            os.remove(path)
          
        for i, t in enumerate(text):
            padding = 0
            if t.isupper(): 
                padding = 0
            else: 
                padding = 1
                
            path = "backup/{}{}.png".format(t, padding)
            if data['type'] == "write": 
                path = "img/{}{}.png".format(t, padding)
            opencv.draw(path, i, t, 10)            
        opencv.generate("cv_img/")
        return "ok"

if __name__ == '__main__':
    # detect.train()
    # detect.evaluate()
    app.run(debug = True)