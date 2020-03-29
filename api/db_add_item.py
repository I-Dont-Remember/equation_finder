import os

from loguru import logger
import boto3

EQUATIONS_TABLE = "equations"

def put_item(dynamodb, item):
    table = dynamodb.Table(EQUATIONS_TABLE)
    resp = table.put_item(item)
    logger.info(resp)

def main():
    os.environ["AWS_PROFILE"] = "kevin"
    dynamodb = boto3.resource("dynamodb", region_name="us-west-1")


    # TODO: how do we ensure a composite variable always has same order of variables
    item = {
        "combined_variables": "v",
        "equation": "v = a + F"
    }
    put_item(dynamodb, item)


if __name__ == "__main__":
    main()