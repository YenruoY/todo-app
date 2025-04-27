from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(150))
    user_name = db.Column(db.String(150))
    datetime = db.Column(db.DateTime(timezone=True), default=func.now())
    todos = db.relationship('ToDo')

    def to_dict(self):
        return {
            'id': self.id,
            'user_name': self.user_name, 'account_created': self.datetime
        }


class ToDo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(500))
    datetime = db.Column(db.DateTime(timezone=True), default=func.now())
    todo_date = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    status = db.Column(db.String(12))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'createtion_date': self.datetime,
            'by_user': self.user_id
        }
