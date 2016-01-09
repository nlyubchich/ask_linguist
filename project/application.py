import os
import logging.config
from importlib import import_module

from flask import Flask
from .extensions import csrf, db, toolbar


def create_app():
    app = Flask(__name__)

    config = os.environ.get('APP_SETTINGS', 'project.config.ProductionConfig')
    app.config.from_object(config)

    with app.app_context():
        for module in app.config.get('DB_MODELS_IMPORT', list()):
            import_module(module)

    logging.config.dictConfig(app.config["LOG_CONFIG"])

    csrf.init_app(app)
    toolbar.init_app(app)
    db.init_app(app)

    return app
