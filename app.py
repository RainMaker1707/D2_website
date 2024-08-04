from flask import Flask, render_template, url_for


app = Flask(__name__, template_folder='templates', static_folder='style')

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/answer')
def answer():
    return render_template("answer.html")
