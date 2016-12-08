import sys,os
import json, requests
import config

from flask import Flask, render_template, request, json, redirect, url_for, jsonify
from flask_wtf.csrf import CsrfProtect

app = Flask(__name__)
csrf = CsrfProtect()
csrf.init_app(app)

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
	getMatchHistory(summonerID)
	return render_template('matchdetail.html')

@app.route("/match-search", methods=['GET','POST'])
def matchDetail():
	for key in request.args:
		print(request.args.get(key))
	summonerId = request.args['summonerId'] + '?'
	url = config.baseurl + config.apis['matchlist'] + summonerId + config.apikey
	response = requests.get(url)
	return jsonify(response)

def getSummonerId(jsonResp):
	jsonObj = json.loads(jsonResp.text)
	nameIdx = list(jsonObj.keys())[0]
	return jsonObj[nameIdx]['id']

def getMatchHistory(summonerId):
	filterMatchIndices = 'beginIndex=0&endIndex=1&'
	url = config.baseurl + config.apis['matchlist'] + str(summonerId) + '?'+ filterMatchIndices + config.apikey
	response = requests.get(url)
	print(json.loads(response.text)['matches'])

if __name__ == '__main__':
	app.run()