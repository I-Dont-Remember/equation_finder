import os
import json

import boto3
from loguru import logger


class VariableMappingException(Exception):
    pass


class EquationSearchException(Exception):
    pass


EQUATIONS_TABLE = "equations"

dynamodb = None
local_cache = None


@logger.catch(reraise=True)
def lambda_handler(event, context):
    global dynamodb

    logger.info("Event {}", event)
    print("==========================")
    if not dynamodb:
        # To use locally with Serverless Offline & localstack
        # os.environ["AWS_ACCESS_KEY_ID"] = "testing"
        # os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
        # os.environ["AWS_SECURITY_TOKEN"] = "testing"
        # os.environ["AWS_SESSION_TOKEN"] = "testing"

        # dynamodb = boto3.resource(
        #     "dynamodb", endpoint_url="http://localhost:4569", region_name="us-west-1"
        # )
        dynamodb = boto3.resource("dynamodb")

    return run(event)


def run(event):
    variables = parse_data(event)

    resp_code = 500
    resp_data = {"search_variables": variables}

    try:
        logger.info("searching for possible equations...")
        possible_equations = equation_search(dynamodb, variables)
        resp_code = 200
        resp_data["possible_equations"] = possible_equations
    except EquationSearchException as e:
        resp_code = 400
        resp_data["error"] = str(e)
    except Exception as e:
        logger.info(e)
        resp_data["error"] = "something went wrong, sorry!"

    resp = {
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True,
        },
        "statusCode": resp_code,
        "body": json.dumps(resp_data),
    }
    logger.info("sending resp {}", resp)
    return resp


def parse_data(event):
    query_params = event["queryStringParameters"]
    variables_param = query_params["variables"]
    return variables_param.split(",")


def equation_search(dynamodb, variables):
    global local_cache

    # do simple version, just fetch entire table...BUT since we're going lazy route,
    # save some of our energy and cache it all locally in memory
    items = []
    if local_cache is None:
        logger.info("Cache-miss, fetch all records from DB")
        table = dynamodb.Table(EQUATIONS_TABLE)
        resp = table.scan()
        try:
            equations = resp["Items"]
            logger.info("ITEMS - {}", equations)
        except KeyError:
            logger.info("No items in the table")
            raise EquationSearchException(
                f"No equations found for combination of variables '{variables}'"
            )

        local_cache = {"equations": equations}
    else:
        logger.info("Cache-hit, dig through the cached records for matches")
        equations = local_cache["equations"]

    # process items now that they've been retrieved
    logger.info("Look for matches...")
    matching_equations = []
    for eq in equations:
        match_item = {}
        equation_variables = eq["equation_variables"].split(",")
        logger.info("equation_vars {}", equation_variables)
        match_variable_count = 0
        for var in variables:
            if var in equation_variables:
                match_variable_count += 1

        # if any matches, add to our list with the confidence we have in it
        if match_variable_count > 0:
            match_item = eq
            confidence = match_variable_count / len(equation_variables)
            match_item["confidence"] = confidence
            logger.info(
                "confidence {} - matched {} equation_vars {}",
                confidence,
                match_variable_count,
                len(equation_variables),
            )
            matching_equations.append(match_item)

    if len(matching_equations) < 1:
        raise EquationSearchException(
            f"No equations found for combination of variables '{variables}'"
        )

    return sorted(matching_equations, key=lambda k: k["confidence"], reverse=True)

# Example event with extraneous removed {
#     "body": None,
#     "httpMethod": "GET",
#     "isBase64Encoded": False,
#     "multiValueQueryStringParameters": {"variables": ["a,123,b,V"]},
#     "path": "/equations",
#     "pathParameters": None,
#     "queryStringParameters": {"variables": "a,123,b,V"},
# }