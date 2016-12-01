import os

from flask import Flask, render_template, request, json
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template('index.html')

@app.route("/signUp")
def signUp():
	return render_template('signUp.html')

@app.route('/signUpUser', methods=['POST'])
def signUpUser():
	user = request.form['username']
	password = request.form['password']
	return json.dumps({'status':'OK','user':user,'password':password})

if __name__ == '__main__':
	app.run()