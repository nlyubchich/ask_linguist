from flask_migrate import MigrateCommand, Migrate
from flask_script import Manager
from project import app
from project.extensions import db

manager = Manager(app)
manager.add_command('db', MigrateCommand)

migrate = Migrate()
migrate.init_app(app, db)

if __name__ == '__main__':
    manager.run()

# Making Travis CI fly!
