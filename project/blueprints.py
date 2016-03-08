from flask import Blueprint, request
from flask.ext.login import current_user
from project.extensions import login_manager


def only_authenticated_user():
    if not (
        current_user.is_authenticated or
        request.endpoint == login_manager.login_view
    ):
        return login_manager.unauthorized()


def _factory(bp_name, url_prefix, restricted=False):
    import_name = 'project.{}.views'.format(bp_name)
    template_folder = 'templates'

    blueprint = Blueprint(
        bp_name,
        import_name,
        template_folder=template_folder,
        url_prefix=url_prefix,
    )

    if restricted:
        blueprint.before_request(only_authenticated_user)

    return blueprint

index_app = _factory("index", '')
dashboard_app = _factory("dashboard", '/dashboard', True)
questionnaire_app = _factory("questionnaire", '/questionnaire', True)

all_blueprints = (index_app, dashboard_app, questionnaire_app,)
