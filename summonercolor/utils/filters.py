from summonercolor import app
from datetime import datetime

@app.template_filter('localDate')
def localDate(seconds): #seconds = milliseconds from epoch, as defined by riot api
	return datetime.fromtimestamp(seconds / 1e3).strftime('%Y-%m-%d %H:%M:%S')
