from whitenoise import WhiteNoise

from project.application import create_app

app = create_app()

TWO_YEARS = 60 * 60 * 24 * 356 * 2
whitenoise_app = WhiteNoise(app, 'project/static', "/static/",
                            max_age=TWO_YEARS)
