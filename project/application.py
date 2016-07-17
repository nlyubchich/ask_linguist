import os
import logging.config
from flask import Flask
from hiku.console.ui import ConsoleApplication
from hiku.engine import Engine
from hiku.executors.sync import SyncExecutor
from importlib import import_module
from werkzeug.wsgi import DispatcherMiddleware

from project.blueprints import all_blueprints
from project.bl import load_user
from project.extensions import (
    csrf, db, toolbar, login_manager, redis_store, oauth
)
from project.graph import GRAPH


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

    engine = Engine(SyncExecutor())
    app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
        '/graph': ConsoleApplication(
            GRAPH, engine, app.config.get('DEBUG', False)
        ),
    })

    return app
