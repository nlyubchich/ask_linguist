from flask import request, jsonify
from hiku.readers.simple import read
from hiku.result import denormalize

from project.blueprints import graph_app as app
from project.extensions import hiku_engine
from project.graph.mapping import GRAPH


@app.route("/", methods=["POST"])
def graph_endpoint():
    request_data = request.data.decode('utf-8')
    request_data = read(request_data)
    result = hiku_engine.execute(GRAPH, request_data)
    result = denormalize(GRAPH, result, request_data)
    return jsonify(result)
