import os
from langchain.document_loaders import TextLoader
from langchain.indexes import VectorstoreIndexCreator
import sys
from langchain.chat_models import ChatOpenAI

# Code used for testing and demo on my computer
def function_gpt_test(api_key) -> str:

    os.environ["OPENAI_API_KEY"] = api_key
    query = sys.argv[1]
    loader = TextLoader('pages.txt')
    index = VectorstoreIndexCreator().from_loaders([loader])

    return index.query(query, llm = ChatOpenAI())

# Code used to be called and run on server or through lambda
def function_gpt(api_key, query) -> str:

    os.environ["OPENAI_API_KEY"] = api_key
    loader = TextLoader('pages.txt')
    index = VectorstoreIndexCreator().from_loaders([loader])

    return index.query(query, llm = ChatOpenAI())

print(function_gpt("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", "How many letters in the english alphabet and best way to remember them?"))

# Output Json with response
xmJson = {
    "response": ""
}