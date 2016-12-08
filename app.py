import sys,os
import json, requests
import config

from flask import Flask, render_template, request, json, redirect, url_for, jsonify
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template('index.html')

@app.route("/summoner")
def summonerLookup():
	return render_template('lookup.html')

@app.route("/summoner-search", methods=['GET','POST'])
def lookup():
	summonerName = request.args.get('summoner') + '?'
	url = config.baseurl + config.apis['summoner'] + summonerName + config.apikey
	response = requests.get(url)
	summonerID = getSummonerId(response)
	history = getMatchHistory(summonerID)
	print(history)
	return render_template('matchdetail.html')

@app.route("/match-search", methods=['GET','POST'])
def matchDetail():
	summonerId = request.args['summonerId'] + '?'
	url = config.baseurl + config.apis['matchlist'] + summonerId + config.apikey
	response = requests.get(url)
	return jsonify(response)

def getSummonerId(jsonResp):
	jsonObj = json.loads(jsonResp.text)
	nameIdx = list(jsonObj.keys())[0]
	return jsonObj[nameIdx]['id']

def getMatchHistory(summonerId):
	matchList = []
	filterMatchIndices = 'beginIndex=0&endIndex=1&'
	url = config.baseurl + config.apis['matchlist'] + str(summonerId) + '?'+ filterMatchIndices + config.apikey
	response = requests.get(url)
	jsonObj = json.loads(response.text)
	for match in jsonObj['matches']:
		matchList.append(match['matchId'])
	return matchList

if __name__ == '__main__':
	app.run()