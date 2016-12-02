import os
import requests
import config

from flask import Flask, render_template, request, json
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template('index.html')

@app.route("/signUp")
def signUp():
	return render_template('signUp.html')

@app.route("/summoner")
def summonerLookup():
	return render_template('lookup.html')

@app.route("/summoner-search", methods=['POST'])
def lookup():
	summonerName = request.form['summoner']
	url = config.baseurl + config.apis['summoner'] + summonerName + config.apikey
	response = requests.get(url)
	return json.dumps(response.json())

@app.route('/signUpUser', methods=['POST'])
def signUpUser():
	user = request.form['username']
	password = request.form['password']
	return json.dumps({'status':'OK','user':user,'password':password})

if __name__ == '__main__':
	app.run()