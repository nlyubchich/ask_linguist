from flask import Blueprint, request
from flask_login import current_user
from project.extensions import login_manager


def _only_authenticated_user_hook():
    if not (
        current_user.is_authenticated or
        request.endpoint == login_manager.login_view
    ) and login_manager._login_disabled is False:
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
        blueprint.before_request(_only_authenticated_user_hook)

    return blueprint

index_app = _factory("index", '')
dashboard_app = _factory("dashboard", '/dashboard', True)
questionnaire_app = _factory("questionnaire", '/questionnaire', True)

all_blueprints = (index_app, dashboard_app, questionnaire_app,)
