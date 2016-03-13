from flask.ext.migrate import MigrateCommand
from flask.ext.script import Manager
from project import app
from project.extensions import db, migrate

manager = Manager(app)
manager.add_command('db', MigrateCommand)

migrate.init_app(app, db)

if __name__ == '__main__':
    manager.run()
