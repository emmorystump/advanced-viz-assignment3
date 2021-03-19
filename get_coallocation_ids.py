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


coallocated_posts = []
startDates=['4/30/2011', '5/1/2011', '5/2/2011', '5/3/2011', '5/4/2011', 
'5/5/2011', '5/6/2011', '5/7/2011' , '5/8/2011', '5/9/2011', '5/10/2011'
, '5/11/2011', '5/12/2011', '5/13/2011', '5/14/2011', '5/15/2011'
,'5/16/2011', '5/17/2011', '5/18/2011', '5/19/2011', '5/20/2011']
endDates = [ '5/1/2011', '5/2/2011', '5/3/2011', '5/4/2011', 
'5/5/2011', '5/6/2011', '5/7/2011' , '5/8/2011', '5/9/2011', '5/10/2011'
, '5/11/2011', '5/12/2011', '5/13/2011', '5/14/2011', '5/15/2011'
,'5/16/2011', '5/17/2011', '5/18/2011', '5/19/2011', '5/20/2011', '5/21/2011']

def np_encoder(object):
    if isinstance(object, np.int64): return int(object)  
    raise TypeError

def isCoallocation(textPhrase, coallocations):
    if (textPhrase==None):
        return False
    for item in coallocations:
        wordOne = item[0][0]
        wordTwo = item[0][1]
        findOne = textPhrase.find(wordOne)
        findTwo = textPhrase.find(wordTwo)
        if findOne != -1 and findTwo !=-1 and abs(findOne-findTwo)<=5:
            return True
    return False


def getAllocationForText(id_arr, text_arr, coallocations):
    for i in range(len(id_arr)):
        textPhrase = text_arr[i]
        if isCoallocation(textPhrase,coallocations):
            coallocated_posts.append(id_arr[i])
    




microblogs_data = pd.read_pickle('cse557_option1_microblogs.pkl copy')
coallacators = pd.read_json('collocations_by_day.json', orient='records')
copy = microblogs_data
strippedDates = microblogs_data['post_date_time'].str.split(' ').str[0]
standardDateForm = pd.to_datetime(strippedDates, format='%m/%d/%Y')
copy['post_date_time'] = standardDateForm



for i in range(len(startDates)):
    print("on date " + str(startDates[i]))
    copy_filteredDate = copy.loc[(copy['post_date_time'] >= startDates[i]) & (copy['post_date_time'] < endDates[i]) ]
    copy_json = copy.to_json(orient='records')
    temp = pd.read_json(copy_json)
    post_ids = temp.post_id
    user_ids = temp.user_id
    times = temp.post_date_time
    locations = temp.location
    texts = temp.text
    coallocations_day = coallacators[startDates[i]]
    filtered_coallocations_day = [a for a in coallocations_day if a != ['','',0]]
    getAllocationForText(post_ids, texts, filtered_coallocations_day)
    if (startDates[i]=="5/20/2011"):
        json_string = json.dumps(coallocated_posts, default=np_encoder)
        with open('cse557_option1_coallocated_microblogs.json', 'w') as f:
            json.dump(json_string, f)



