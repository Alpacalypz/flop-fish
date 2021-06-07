#Team Flop-Fish (Madelyn Mao, Andrew Jiang, Benjamin Gallai, William Li)
#SoftDev 
#P5 -- This is the End
#2021-6-02

from flask import Flask,session            #facilitate flask webserving
from flask import render_template   #facilitate jinja templating
from flask import request, redirect           #facilitate form submission
from datetime import datetime
import os
import sqlite3   #enable control of an sqlite database
import json
import requests
import random
import base64

n= [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
random.shuffle(n)

score = 0
arr= [
    [n[0],n[1],n[2],n[3]],
    [n[4], n[5], n[6],n[7]],
    [n[8], n[9], n[10],n[11]],
    [n[12], n[13], n[14],n[15]]
    ]

DB_FILE="discobandit.db"
db = sqlite3.connect(DB_FILE, check_same_thread = False) #open if file exists, otherwise create
c = db.cursor()               #facilitate db ops -- you will use cursor to trigger db events

#database table
c.execute('CREATE TABLE IF NOT EXISTS users(ID INTEGER NOT NULL PRIMARY KEY, Username text NOT NULL, Password text, Duck15 integer, ducksu interger);')
db.commit()
app = Flask(__name__)    #create Flask object
app.secret_key = os.urandom(24)

@app.route("/") #, methods=['GET', 'POST'])
def disp_loginpage():
	if 'username' in session:
		return render_template('response.html', user = session['username'], status = True)
	else:
		return render_template('login.html',status=False)

@app.route("/auth") # , methods=['GET', 'POST'])
def authenticate():
    problem = 'none'
    if request.args['username'] == '' or request.args['password'] == '': #Check if fields are filled
        return render_template('error.html', error = 'Some fields are empty, try again')     
    print("\n\n\n")
    print("***DIAG: this Flask obj ***")
    print(app)
    print("***DIAG: request obj ***")
    print(request)
    print("***DIAG: request.args ***")
    print(request.args)
    print("***DIAG: request.args['username']  ***")
    print(request.args['username'])
    print("***DIAG: request.headers ***")
    print(request.headers)
    username = request.args['username']
    password = request.args['password']
    c = db.cursor()
    c.execute('SELECT * FROM users WHERE username=? AND password = ?', (username,password))
    data = c.fetchall()

    Duck15 = 0
    ducksu = 0

    if data: 
            session['username'] = username
            session['password'] = password
            c.execute('SELECT ID FROM users WHERE username=? AND password = ?', (username,password))
            userid = c.fetchone()
            session['UserID'] = int(userid[0])


            
            return render_template('response.html')
    else:
        c.execute('SELECT * FROM users WHERE username=?', (username,))
        username_data = c.fetchall()
        if len(username_data)==0:
            return render_template('error.html',status=False,error="User isn't registered. Please create an account.")
        else:
            return render_template('error.html',status=False,error="Incorrect Username/Password.")


# sign up for an account, signup.html takes username, password, bio 
# check if username is unique, add password specifications if desired

@app.route("/signup") #methods = ['GET','POST'])
def signup():
        global usercount
        c = db.cursor()
        username = request.args['newusername']
        password = request.args['newpassword']
        c.execute('SELECT * FROM users WHERE username=?', (username,))
        data = c.fetchall()
        if len(data) > 0:
            return render_template('error.html', error = 'A user with that username already exists.')
        params = (username,password)
        c.execute('INSERT INTO users(Username,Password) VALUES(?,?)', params)
        db.commit()
        return render_template('login.html',status=False)

# middle method, going straight to signup doesn't work. renders the actual signup page    
@app.route("/newuser", methods = ['GET','POST'])
def newuser():
        return render_template('signup.html',status=False)


@app.route("/ducksu", methods = ['GET', 'POST'])
def ducksu():
    return render_template("ducksu.html", status = False)

##display original square
@app.route("/duck15", methods = ['GET', 'POST'])
def duck15():
    stringarr = []
    for index1, items in enumerate(arr):
        for index2, itemss in enumerate(items):
            stringarr.append(str(arr[index1][index2]))
    return render_template("duck15.html", array = arr, array1 = stringarr, status = False)
    #return render_template("duck15.html", array = arr, status = False)

# 0 goes down
@app.route('/up/')
def up():
    for index1, items in enumerate(arr):
        for index2, itemss in enumerate(items):
            #print(arr[index1][index2])
            if arr[index1][index2] == 0:
                a = index1
                b = index2
                #score += 1
    
    if a != 3:
        arr[a][b] = arr[a + 1][b]
        arr[a + 1][b] = 0
        #score += 1
    stringarr = []
    for index1, items in enumerate(arr):
        for index2, itemss in enumerate(items):
            stringarr.append(str(arr[index1][index2]))
    return render_template("duck15.html", array = arr, array1 = stringarr, Score = score + 1, status = False)

# 0 goes up
@app.route('/down/')
def down():
    for index1, items in enumerate(arr):
        for index2, itemss in enumerate(items):
            #print(arr[index1][index2])
            if arr[index1][index2] == 0:
                if index1 != 0:
                    arr[index1][index2] = arr[index1 - 1][index2]
                    arr[index1 - 1][index2] = 0
                    #score += 1
                    break
    stringarr = []
    for index1, items in enumerate(arr):
        for index2, itemss in enumerate(items):
            stringarr.append(str(arr[index1][index2]))
    return render_template("duck15.html", array = arr, array1 = stringarr, Score = score + 1, status = False)

#0 goes right
@app.route('/left/')
def left():
    for index1, items in enumerate(arr):
        for index2, itemss in enumerate(items):
            #print(arr[index1][index2])
            if arr[index1][index2] == 0:
                a = index1
                b = index2
                #score += 1
    
    if b != 3:
        arr[a][b] = arr[a][b+1]
        arr[a][b+1] = 0
        #score += 1
    stringarr = []
    for index1, items in enumerate(arr):
        for index2, itemss in enumerate(items):
            stringarr.append(str(arr[index1][index2]))
    return render_template("duck15.html", array = arr, array1 = stringarr, Score = score + 1, status = False)

@app.route('/right/')
def right():
    print(score)
    for index1, items in enumerate(arr):
        for index2, itemss in enumerate(items):
            #print(arr[index1][index2])
            if arr[index1][index2] == 0:
                a = index1
                b = index2
                #score += 1
    
    if b != 0:
        arr[a][b] = arr[a][b-1]
        arr[a][b-1] = 0
        #score += 1
    stringarr = []
    for index1, items in enumerate(arr):
        for index2, itemss in enumerate(items):
            stringarr.append(str(arr[index1][index2]))
    return render_template("duck15.html", array = arr, array1 = stringarr, Score = score + 1, status = False)



if __name__ == "__main__": #false if this file imported as module
    #enable debugging, auto-restarting of server when this file is modified
    app.debug = True 
    app.run()