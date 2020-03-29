import os
import json

import boto3
from loguru import logger


class VariableMappingException(Exception):
    pass


class EquationSearchException(Exception):
    pass


dynamodb = None


@logger.catch(reraise=True)
def lambda_handler(event, context):
    global dynamodb

    print(event)
    if not dynamodb:
        dynamodb = boto3.resource("dynamodb")

    return run(event)


def run(event):
    variables =  parse_data(event)

    resp_code = 500
    resp_data = {
        "search_variables": variables
    }

    try:
        possible_equations = equation_search(dynamodb, variables)
        resp_code = 200
        resp_data["possible_equations"] = possible_equations
    except Exception as e:
        resp_data["error"] = str(e)

    resp = {
        "statusCode": resp_code,
        "body": json.dumps(resp_data),
    }
    return resp


def parse_data(event):
    query_params = event["queryStringParameters"]
    variables_param = query_params["variables"]
    return variables_param.split(",")

def equation_search(dynamodb, variables):
    # TODO: get item for each combination of variables we have?
    # resp = dynamodb.get_item()
    raise EquationSearchException(f"No equations found for combination of variables '{variables}'")


# # TODO: unubo looks clean but is a dud for docs & deployments
# def handle(req):
#     print(type(req))
#     print(req)

#     body = req.get_json()
#     equation_variables = body["equation_variables"]

#     try:
#         mapped_vars = variable_mapper(equation_variables)
#         matching_equations = equation_search(mapped_vars)
#         resp_data = {
#             "possible_equations": matching_equations
#         }
#         resp_code = 200
#     except Exception as e:
#         resp_data = {
#             "error": e
#         }
#         resp_code = 400

#     return resp_data, resp_code
#     # return make_response(jsonify(resp_data), resp_code)

# def variable_mapper(input_variables):
#     MapDB = {
#         "initial velocity": "v0",
#         "final velocity": "vF",
#         "acceleration": "a",
#         "another variable": "aV"
#     }

#     mapped_variables = []
#     for var in input_variables:
#         try:
#             mapped_variables.append(MapDB[var])
#         except KeyError:
#             raise VariableMappingException(f"Couldn't map variable '{var}'' to a standardized form.")
#     return mapped_variables

# def equation_search(variables):
#     equations = [
#         {
#             "name": "does something",
#             "variables": ["v0", "vF", "a"]
#         }
#     ]

#     match_list = []

#     for e in equations:
#         if all(x in e["variables"] for x in variables):
#             match_list.append(e)
#     if len(match_list) < 1:
#         raise EquationSearchException(f"No equations found for combination of variables '{variables}'")

#     return match_list

# if __name__ == "__main__":
#     class Request:
#         def __init__(self, variables):
#             self.j = {
#                 "equation_variables": variables
#             }

#         def get_json(self):
#             return self.j

#     req = Request([
#         "initial velocity",
#         "final velocity",
#         "acceleration"
#     ])
#     resp = handle(req)
#     print("Happy Path", resp)

#     req = Request([
#         "donk",
#         "butts",
#         "booty"
#     ])
#     resp = handle(req)
#     print("Sad Path - no matching variable", resp)

#     req = Request([
#         "initial velocity",
#         "final velocity",
#         "acceleration",
#         "another variable"
#     ])
#     resp = handle(req)
#     print("Sad Path - no matching equations", resp)

var = {
    "body": None,
    "headers": {
        "Host": "localhost:3000",
        "User-Agent": "HTTPie/0.9.8",
        "Accept-Encoding": "gzip, deflate",
        "Accept": "*/*",
        "Connection": "keep-alive",
    },
    "httpMethod": "GET",
    "isBase64Encoded": False,
    "multiValueHeaders": {
        "Host": ["localhost:3000"],
        "User-Agent": ["HTTPie/0.9.8"],
        "Accept-Encoding": ["gzip, deflate"],
        "Accept": ["*/*"],
        "Connection": ["keep-alive"],
    },
    "multiValueQueryStringParameters": {"variables": ["a,123,b,V"]},
    "path": "/equations",
    "pathParameters": None,
    "queryStringParameters": {"variables": "a,123,b,V"},
    "requestContext": {
        "accountId": "offlineContext_accountId",
        "apiId": "offlineContext_apiId",
        "authorizer": {"principalId": "offlineContext_authorizer_principalId"},
        "domainName": "offlineContext_domainName",
        "domainPrefix": "offlineContext_domainPrefix",
        "extendedRequestId": "ck8casdvw0003h1yk0gpna0xc",
        "httpMethod": "GET",
        "identity": {
            "accessKey": None,
            "accountId": "offlineContext_accountId",
            "apiKey": "offlineContext_apiKey",
            "caller": "offlineContext_caller",
            "cognitoAuthenticationProvider": "offlineContext_cognitoAuthenticationProvider",
            "cognitoAuthenticationType": "offlineContext_cognitoAuthenticationType",
            "cognitoIdentityId": "offlineContext_cognitoIdentityId",
            "cognitoIdentityPoolId": "offlineContext_cognitoIdentityPoolId",
            "principalOrgId": None,
            "sourceIp": "127.0.0.1",
            "user": "offlineContext_user",
            "userAgent": "HTTPie/0.9.8",
            "userArn": "offlineContext_userArn",
        },
        "path": "/dev/equations",
        "protocol": "HTTP/1.1",
        "requestId": "ck8casdvw0004h1yk1wd4dsgn",
        "requestTime": "28/Mar/2020:19:20:55 -0500",
        "requestTimeEpoch": 1585441255242,
        "resourceId": "offlineContext_resourceId",
        "resourcePath": "/equations",
        "stage": "dev",
    },
    "resource": "/equations",
    "stageVariables": None,
}
