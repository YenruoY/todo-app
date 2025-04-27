from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_cors import CORS
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
jwt = JWTManager()
DB_NAME = "database.db"
UPLOAD_FOLDER = "/static/"


def create_app():
    app = Flask(__name__)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['SECRET_KEY'] = 'sakljdf'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

    CORS(app, origins="*")

    db.init_app(app)
    jwt.init_app(app)

    from .routes.actions_routes import user_actions
    from .routes.auth_routes import testing_routes, auth_routes
    user_actions(app)
    testing_routes(app)
    auth_routes(app)

    from .models import User

    create_database(app)

    return app


def create_database(app):
    if not path.exists('website/' + DB_NAME):
        with app.app_context():
            db.create_all()
        print("Created databse..")
