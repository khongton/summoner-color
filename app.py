import sys,os, time
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
	return render_template('matchlist.html', matchHist = history, summoner = response.json())

@app.route("/match-search", methods=['GET','POST'])
def matchDetail():
	summonerId = request.args['summonerId'] + '?'
	url = config.baseurl + config.apis['matchlist'] + summonerId + config.apikey
	response = requests.get(url)
	return jsonify(response)

def getSummonerId(jsonResp):
	jsonObj = json.loads(jsonResp.text)
	print(jsonObj)
	nameIdx = list(jsonObj.keys())[0]
	return jsonObj[nameIdx]['id']

def getMatchHistory(summonerId):
	url = config.baseurl + config.apis['recentgames'] + str(summonerId) + '/recent?'+ config.apikey
	response = requests.get(url)
	if response.status_code != requests.codes.ok:
		print('Server might be busy or you exceeded rate limit. Try again later.')
		sys.exit()
	jsonObj = json.loads(response.text)
	return jsonObj

def getMatchDetail(history):
	matchDetails = []
	includeTime = '?includeTimeline=true&'
	for match in history:
		url =  config.baseurl + config.apis[matchDetail] + str(match) + includeTime + config.apikey
		response = requests.get(url)
		matchDetails.append(json.loads(response.text))
	return matchDetails


if __name__ == '__main__':
	app.run()