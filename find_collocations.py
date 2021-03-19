import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import math
import statistics
from scipy import stats
import statsmodels.api as sm
import json 
import random
import nltk as nltk
import nltk.corpus
import nltk.collocations
import nltk.metrics
import re
import collections

#https://stackoverflow.com/questions/40442014/python-pandas-valueerror-arrays-must-be-all-same-length
def pad_dict_list(dict_list, padel):
    lmax = 0
    for lname in dict_list.keys():
        lmax = max(lmax, len(dict_list[lname]))
    for lname in dict_list.keys():
        ll = len(dict_list[lname])
        if  ll < lmax:
            dict_list[lname] += [padel] * (lmax - ll)
    exportItems(dict_list)


def exportItems(exportDict):
    with open("collocations_by_day.json", "w") as outfile:  
        json.dump(exportDict, outfile)   
    



exporter = {}
#https://www.geeksforgeeks.org/nlp-word-collocations/
def getNGrams(textItems, date ):
    stopset = set(nltk.corpus.stopwords.words('english')) 
    filter_stops = lambda w: len(w) < 3 or w in stopset 
    line = ""
    open_file = open(textItems,'r')
    for val in open_file:
        line += val
    tokens = line.split()
    bigram_measures = nltk.collocations.BigramAssocMeasures()
    finder = nltk.collocations.BigramCollocationFinder.from_words(tokens, window_size = 5)
    finder.apply_freq_filter(40)
    finder.apply_word_filter(filter_stops)
    allBigrams = []
    for k,v in finder.ngram_fd.items():
        newTuple = tuple((k, v))
        allBigrams.append(newTuple)
    exporter[date] = allBigrams
    if (date=='5/20/2011'):
        pad_dict_list(exporter, ('','', 0))

    print(finder.score_ngrams(bigram_measures.pmi))

startDates=['4/30/2011', '5/1/2011', '5/2/2011', '5/3/2011', '5/4/2011', 
'5/5/2011', '5/6/2011', '5/7/2011' , '5/8/2011', '5/9/2011', '5/10/2011'
, '5/11/2011', '5/12/2011', '5/13/2011', '5/14/2011', '5/15/2011'
,'5/16/2011', '5/17/2011', '5/18/2011', '5/19/2011', '5/20/2011']
endDates = [ '5/1/2011', '5/2/2011', '5/3/2011', '5/4/2011', 
'5/5/2011', '5/6/2011', '5/7/2011' , '5/8/2011', '5/9/2011', '5/10/2011'
, '5/11/2011', '5/12/2011', '5/13/2011', '5/14/2011', '5/15/2011'
,'5/16/2011', '5/17/2011', '5/18/2011', '5/19/2011', '5/20/2011', '5/21/2011']

microblogs_data = pd.read_pickle('cse557_option1_microblogs.pkl copy')
copy = microblogs_data
strippedDates = microblogs_data['post_date_time'].str.split(' ').str[0]
standardDateForm = pd.to_datetime(strippedDates, format='%m/%d/%Y')
copy['post_date_time'] = standardDateForm
for i in range(len(startDates)):
    filteredDate = copy.loc[(copy['post_date_time'] >= startDates[i]) & (copy['post_date_time'] < endDates[i]) ]
    np.savetxt('datetext.txt', filteredDate['text'], fmt='%s')
    getNGrams('datetext.txt', startDates[i])