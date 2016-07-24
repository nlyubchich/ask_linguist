from whitenoise import WhiteNoise

from project.application import create_app

app = create_app()

whitenoise_app = WhiteNoise(app, './static')
