from flask import Flask
from flask import render_template, jsonify, abort, session, send_file,  request, redirect, url_for, current_app, flash
from models import db

app = Flask(__name__)

POSTGRES = {
    'user': 'postgres',
    'pw': '12345',
    'db': 'restaurant',
    'host': 'localhost',
    'port': '5432',
}

app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:\
%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES
db.init_app(app)


@app.route("/")
def main():
    return 'Hello World !'


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        data_received = request.data
        return data_received
    return 'Hello World !'


if __name__ == '__main__':
    app.run(debug=True)
