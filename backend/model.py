from flask import Flask
from config import db
from sqlalchemy.dialects.postgresql import JSON

class Gif(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    process_id = db.Column(db.String(80), nullable=False, unique=True)
    front_kps = db.Column(JSON)
    back_kps = db.Column(JSON)
    
    def to_json(self):
        return {
            'process_id': self.process_id,
            'front_kps': self.front_kps,
            'back_kps': self.back_kps,
        }
    