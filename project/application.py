import os
import logging.config
from flask import Flask
from importlib import import_module
from project.blueprints import all_blueprints
from .extensions import csrf, db, toolbar, login_manager, redis_store


def create_app():
    app = Flask(__name__)

    config = os.environ.get('APP_SETTINGS', 'project.config.ProductionConfig')
    app.config.from_object(config)

    with app.app_context():
        for module in app.config.get('DB_MODELS_IMPORT', list()):
            import_module(module)

    for bp in all_blueprints:
        import_module(bp.import_name)
        app.register_blueprint(bp)

    login_manager.login_view = "index.signup"

    logging.config.dictConfig(app.config["LOG_CONFIG"])

    csrf.init_app(app)
    toolbar.init_app(app)
    db.init_app(app)
    login_manager.init_app(app)
    redis_store.init_app(app)

    return app
