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
            '?apiKey='+constants['API']+'&fulltext=false&urls=true'
        headers = {'Content-Type': 'application/json',
                   'Authorization': constants['API']}
        topics = body[0]["topics"]
        recommendations = []
        for topic in topics:
            requestData = {
                "query": topic["id"],
                "page": body[0]["page"],
                "pageSize": 50,
            }
            result = requests.post(
                url, data=json.dumps([requestData]), headers=headers)
            articles = result.json()[0]["data"]
            terms = topic["related_topics"]
            formated = list(filter(lambda article: article.get("description"),articles))
            for item in formated:
                item["related_topics"] = []
            scores = []
            for i, term in enumerate(terms):
                term = term.lower() + ' '
                nt = 0
                idf = 0
                for article in formated:
                    description = article["description"].lower()
                    if term in description:
                        article["related_topics"].append(term)
                        nt = nt + 1
                for j, article in enumerate(formated):
                    description = article["description"].lower()
                    tf = description.count(term)
                    idf = idf + abs(math.log10(len(formated)/(nt+1)))
                    tdidf = tf*idf
                    if i == 0:
                        article["score"] = tdidf
                        scores.append(article)
                    elif i < len(terms):
                        scores[j]["score"] += scores[j]["score"] + tdidf
            auxScores = []
            maxValueScore = max(scores, key = lambda score: score["score"])
            maxValue = maxValueScore["score"]
            print(maxValue)
            for score in scores:
                if score['score'] != 0:
                    score["score"] = score["score"]/maxValue
                    score["topic_id"] = topic["id"]
                    auxScores.append(score)
            auxScores.sort(key=lambda item:item["score"], reverse= True)
            recommendations += auxScores
        projects_id = list(map(lambda recommendation: recommendation.get("id"), recommendations))
        return {'result': recommendations, 'projects_id': projects_id}, 201


api.add_resource(HelloWorld, '/')
api.add_resource(Recommend, '/recommend')

if __name__ == "__main__":
    app.run(debug=True)
