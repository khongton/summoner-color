from flask import Flask, render_template, request, json, redirect, url_for, jsonify

app = Flask(__name__)
from .utils import filters
import summonercolor.views