import sys,os, time
import json, requests
import config

from flask import Flask, render_template, request, json, redirect, url_for, jsonify
from datetime import datetime
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
	return render_template('listing.html', matchHist = history, summoner = response.json())

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
	url = config.baseurl + config.apis['recentgames'] + str(summonerId) + '/recent?'+ config.apikey
	response = requests.get(url)
	if response.status_code != requests.codes.ok:
		print('Server might be busy or you exceeded rate limit. Try again later.')
		sys.exit()
	jsonObj = json.loads(response.text)
	return jsonObj

@app.template_filter('localDate')
def localDate(seconds): #seconds = milliseconds from epoch as defined by riot api
	return datetime.fromtimestamp(seconds / 1e3).strftime('%Y-%m-%d %H:%M:%S')

if __name__ == '__main__':
	app.run()