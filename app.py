import os
import requests
import config

from flask import Flask, render_template, request, json, redirect, url_for
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template('index.html')

@app.route("/summoner")
def summonerLookup():
	return render_template('lookup.html')

@app.route("/summoner-search", methods=['GET','POST'])
def lookup():
	summonerName = request.form['summoner'] + '?'
	url = config.baseurl + config.apis['summoner'] + summonerName + config.apikey
	response = requests.get(url)
	return url_for('matchDetail')

@app.route("/match")
def matchDetail():
	return render_template('matchdetail.html')
'''
	match = str(request.json['summonerid']) + '?'
	filterMatchIndices = 'beginIndex=0&endIndex=1&'
	url = config.baseurl + config.apis['matchlist'] + match + filterMatchIndices + config.apikey
	response = requests.get(url)
	return render_template('matchdetail.html', jsonData = json.dumps(response.json()))
	'''
'''
@app.route("/matchdetail", methods=['POST'])
def matchDetails():
	matchID = str(request.json['matchid']) + '?'
	includeTimeline = 'includeTimeline=true&'
	url = config.baseurl + config.apis['matchdetail'] + matchID + includeTimeline + config.apikey
	response = requests.get(url)
'''
if __name__ == '__main__':
	app.run()