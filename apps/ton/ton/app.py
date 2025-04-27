from jina import Deployment
from .executors.sentiment_executor import SentimentExecutor
from docarray import DocList
from docarray.documents import TextDoc



def main():
    with Deployment(uses=SentimentExecutor) as dep:
        response_docs = dep.post(on='/', inputs=DocList[TextDoc]([TextDoc(text='hello')]), return_type=DocList[TextDoc])
        print(f'Text: {response_docs[0].text}')