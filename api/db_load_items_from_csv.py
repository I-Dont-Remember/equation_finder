import os
import csv

from loguru import logger
import boto3

EQUATIONS_TABLE = "equations"
CSV_PATH = "./equations-sheet.csv"

def put_item(dynamodb, item):
    table = dynamodb.Table(EQUATIONS_TABLE)
    resp = table.put_item(Item=item)
    logger.info(resp)

def main():
    # To use locally with Localstack and Serverless offline
    # os.environ['AWS_ACCESS_KEY_ID'] = 'testing'
    # os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'
    # os.environ['AWS_SECURITY_TOKEN'] = 'testing'
    # os.environ['AWS_SESSION_TOKEN'] = 'testing'
    # dynamodb = boto3.resource("dynamodb", endpoint_url="http://localhost:4569", region_name="us-west-1")

    os.environ["AWS_PROFILE"] = "kevin"
    dynamodb = boto3.resource("dynamodb", region_name="us-west-1")
    
    items = []
    with open(CSV_PATH) as f:
        reader = csv.DictReader(f)
        items = [dict(r) for r in reader]
    
    for item in items:
        valid_keys = ["name", "equation", "equation_variables", "description"]
        filtered_dict = {k:v for k,v in item.items() if k in valid_keys}
        filtered_dict["equation_variables"] = filtered_dict["equation_variables"].replace(" ", "")
        print(filtered_dict)
        item = filtered_dict
        put_item(dynamodb, item)

    # TODO: how do we ensure a composite variable always has same order of variables
    item = {
        "combined_variables": "v",
        "equation": "v = a + F"
    }


if __name__ == "__main__":
    main()