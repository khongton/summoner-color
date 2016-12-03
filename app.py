import os
import requests
import config

from flask import Flask, render_template, request, json
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template('index.html')

@app.route("/summoner")
def summonerLookup():
	return render_template('lookup.html')

@app.route("/summoner-search", methods=['POST'])
def lookup():
	summonerName = request.form['summoner']
	url = config.baseurl + config.apis['summoner'] + summonerName + config.apikey
	response = requests.get(url)
	return json.dumps(response.json())

@app.route("/matchlist", methods=['POST'])
def matchLookup():
	match = request.json['summonerid']
	filterMatchIndices = '?beginIndex=0&endIndex=5'
	url = config.baseurl + config.apis['matchlist'] + str(match) + filterMatchIndices + config.apikey
	print(url)
	response = requests.get(url)
	return json.dumps(response.json())

@app.route("/matchdetail", methods=['POST'])
def matchDetails():
	matchID = request.json['matchid']
	url = config.baseurl + config.apis['matchdetail'] + str(matchID) + config.apikey
	response = requests.get(url)
	return json.dumps(respons.json())

if __name__ == '__main__':
	app.run()