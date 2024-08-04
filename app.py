from flask import Flask, render_template, request, redirect
from scripts.model_helper import *


app = Flask(__name__, template_folder='templates', static_folder='style')

@app.route('/', methods=["GET"])
def home():
    return render_template("home.html")

@app.route('/upload', methods=["POST"])
def upload():
    file = request.files["file"]
    file.save('./temp/'+file.filename)
    return redirect(f'/answer?percentage={fullchain("./models/layer1.h5", "./temp/"+file.filename)}', code=301)
    

@app.route('/answer', methods=['GET'])
def answer(percentage=0.0):
    if request.args.get('percentage'):
        percentage = request.args.get('percentage')
    return render_template("answer.html", PERCENTAGE=percentage)
