import os
import requests
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
	return render_template('matchdetail.html', data = response.json())
	'''
	summonerName = request.form['summoner'] + '?'
	url = config.baseurl + config.apis['summoner'] + summonerName + config.apikey
	response = requests.get(url)
	return url_for('matchDetail')
	'''

if __name__ == '__main__':
	app.run()