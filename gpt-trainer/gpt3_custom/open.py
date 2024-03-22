import os
from langchain.document_loaders import TextLoader
from langchain.indexes import VectorstoreIndexCreator
import sys
from langchain.chat_models import ChatOpenAI

def function(api_key) -> str:

    os.environ["OPENAI_API_KEY"] = api_key
    query = sys.argv[1]
    loader = TextLoader('pages.txt')
    index = VectorstoreIndexCreator().from_loaders([loader])

    return index.query(query, llm = ChatOpenAI())

print(function("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"))