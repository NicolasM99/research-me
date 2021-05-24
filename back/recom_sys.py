from flask import Flask, request
from flask_cors import CORS
import math
import requests
import json
from flask_restful import Resource, Api
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_ORIGINS'] = 'https://localhost:5000'
app.config['CORS_METHODS'] = ["GET", "HEAD",
                              "POST", "OPTIONS", "PUT", "PATCH", "DELETE"]
api = Api(app)
with open('constants.json') as j:
    constants = json.load(j)
    print('CONSTANTS', constants['ARTICLES_SEARCH'])


class HelloWorld(Resource):
    def get(self):
        return {'about': 'Working!'}


class Recommend(Resource):

    def post(self):
        body = request.get_json()
        url = constants['BASE'] + constants['ARTICLES_SEARCH'] + \
            '?apiKey='+constants['API']+'&fulltext=true'
        headers = {'Content-Type': 'application/json',
                   'Authorization': constants['API']}
        result = requests.post(
            url, data=json.dumps(body), headers=headers)
        articles = result.json()[0]["data"]
        formated = []
        terms = body[0]["terms"]
        for article in articles:
            if article["fullText"]:
                newData = {
                    "id": article["id"],
                    "content": article["fullText"]
                }
                formated.append(newData)
        scores = []

        for i, term in enumerate(terms):
            term = term.lower() + ' '
            nt = 0
            idf = 0
            for article in formated:
                fullText = article["content"].lower()
                if term in fullText:
                    nt = nt + 1
            for j, article in enumerate(formated):
                fullText = article["content"].lower()
                tf = fullText.count(term)
                idf = idf + abs(math.log10(len(formated)/(nt+1)))
                tdidf = tf*idf
                if tdidf != 0:
                    tdidf = 1 - 1/tdidf
                print(nt)
                newData = {}
                if i == 0:
                    newData = {
                        "id": article["id"],
                        "score": tdidf
                    }
                    scores.append(newData)
                elif i < len(terms):
                    newData = {
                        "id": scores[j]["id"],
                        "score": scores[j]["score"] + tdidf
                    }
                    scores[j] = newData
        auxScores = []
        for score in scores:
            if score['score'] != 0:
                auxScores.append(score)
        recommendations = []
        return {'result': auxScores, 'completeResult': result.json()[0]}, 201


api.add_resource(HelloWorld, '/')
api.add_resource(Recommend, '/recommend')

if __name__ == "__main__":
    app.run(debug=True)
