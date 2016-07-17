import os
import logging.config
from flask import Flask
from importlib import import_module

from project.blueprints import all_blueprints
from project.bl import load_user
from project.extensions import (
    csrf, db, toolbar, login_manager, redis_store, oauth,
)


def create_app():
    app = Flask(__name__)

    config = os.environ.get('APP_SETTINGS', 'project.config.ProductionConfig')
    app.config.from_object(config)

    for bp in all_blueprints:
        import_module(bp.import_name)
        app.register_blueprint(bp)

    login_manager.login_view = "index.register"

    logging.config.dictConfig(app.config["LOG_CONFIG"])

    csrf.init_app(app)
    toolbar.init_app(app)
    db.init_app(app)
    # FIXME: OMG Flask-SQLAlchemy doesn't set app instance when init_app()
    db.app = app
    login_manager.init_app(app)
    login_manager.user_loader(load_user)
    redis_store.init_app(app)
    oauth.init_app(app)

    return app
