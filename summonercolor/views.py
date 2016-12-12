from summonercolor import *
import config, json, requests

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/summoner')
def summonerLookup():
	return render_template('lookup.html')

@app.route('/summoner-search', methods=['GET', 'POST'])
def lookup():
	summonerName = request.args.get('summoner') + '?'
	url = config.baseurl + config.apis['summoner'] + summonerName + config.apikey
	response = requests.get(url)
	summoner = json.loads(response.text)
	summonerId = getSummonerId(summoner)
	history = getMatchHistory(summonerId)
	getChampInfo(history['games'])
	return render_template('listing.html', matchHist = history, summoner = summoner)

@app.route('/match-search', methods=['GET', 'POST'])
def matchDetail():
	summonerId = request.args['summonerId'] + '?'
	url = config.baseurl + config.apis['matchlist'] + summonerId + config.apikey
	response = requests.get(url)
	return json.loads(response.text)

@app.route('/match-data/<summoner>/<matchid>')
def detailPage(matchid, summoner):
	includeTimeline = '?includeTimeline=true&'
	url = config.baseurl + config.apis['matchdetail'] + str(matchid) + includeTimeline + config.apikey
	response = requests.get(url)
	if response.status_code == requests.codes.too_many_requests:
		print('Underlying service possibly rate limited')
		return render_template('detail.html', id=matchid)
	print('Returned with JSON response')
	match = json.loads(response.text)
	return render_template('detail.html', match=match, requestName = summoner)

def getSummonerId(jsonObj):
	print(jsonObj)
	nameIdx = list(jsonObj.keys())[0]
	return jsonObj[nameIdx]['id']

def getMatchHistory(summonerId):
	url = config.baseurl + config.apis['recentgames'] + str(summonerId) + '/recent?' + config.apikey
	response = requests.get(url)
	history = json.loads(response.text)
	return history

def getChampInfo(gameHistory):
	for match in gameHistory:
		url = config.staticurl + config.staticapi['champion'] + str(match['championId']) + '?' + config.apikey
		response = requests.get(url)
		champInfo = json.loads(response.text)
		match['championId'] = champInfo