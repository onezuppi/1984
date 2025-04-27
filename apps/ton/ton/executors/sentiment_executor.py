from jina import Executor, requests
from transformers import pipeline
from docarray import DocList
from docarray.documents import TextDoc


class SentimentExecutor(Executor):
    def __init__(self, model_name: str = 'nlptown/bert-base-multilingual-uncased-sentiment', **kwargs):
        super().__init__(**kwargs)
        self.sentiment_pipeline = pipeline('sentiment-analysis', model=model_name)

    @requests
    def analyze(self, docs: DocList[TextDoc], **kwargs):
        texts = [doc.text for doc in docs]
        results = self.sentiment_pipeline(texts)
        for doc, res in zip(docs, results):
            doc.tags['label'] = res['label']
            doc.tags['score'] = res['score']
