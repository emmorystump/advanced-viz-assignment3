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

def np_encoder(object):
    if isinstance(object, np.int64): return int(object)  
    raise TypeError

def isSick(text, identifiers):
    # text = text.lower()
    text = json.dumps(text)
    text = text.lower()
    for word in identifiers:
        if text.find(word) != -1:
            # print(text)
            return True
    return False

microblogs_data = pd.read_pickle('cse557_option1_microblogs.pkl copy')
microblogs_data_json = microblogs_data.to_json(orient='records')
temp = pd.read_json(microblogs_data_json)

# print(len(temp.location))
num_records = len(temp.location)

identifiers = ["flu", "flu-like", "tired", "fatigue", "fever", "ill", "doctor", "doc", "nurse", "ER", 
"emergency room", "paramedic", "appointment", "schedule", "ambulance", "patient", 
"sick", "sore", "medicine", "pain", "ache", "headache",
"hurt", "diarrhea", "runs", "office", "doctor's office",
"hospital", "chill", "chills", "germ", "bug", "virus", "sneeze", "sneezes", "sneezing", "hot",
"cold", "freezing", "burning", "stomachache", "tummyache", "stomach", "tummy", "parched", "dry",
"scratchy", "contagion", "contagious", "quarantine", "pneumonia", "bronchitis", "lung", "lungs",
"drugs", "drug", "prescription", "prescriptions", "weak", "weakness", "shake", "shakes", "shaky",
"sweating", "sweats", "sweat", "allergy", "allergies", "allergic", "swelling", "swell", "swells", "swollen", 
"vomit", "vomiting", "nausea", "dizzy", "dizziness", "infected", "infectious", "cough", "cold", "stuffy", "runny", "hacking", "hack", "feverish",
 "meds", "med", "pharmacy", "pharmacist", "emergency"]

sick_posts = []

post_ids = temp.post_id
user_ids = temp.user_id
times = temp.post_date_time
locations = temp.location
texts = temp.text


for i in range(num_records):
    text = texts[i]
    if isSick(text, identifiers):
        sick_posts.append(post_ids[i])

# print(len(sick_posts))

temp.to_json('cse557_option1_microblogs.json')

json_string = json.dumps(sick_posts, default=np_encoder)

with open('cse557_option1_sick_microblogs.json', 'w') as f:
    json.dump(json_string, f)

# print(json_string)
# json_string.to_json('cse557_option1_sick_microblogs.json')


sampled_sick_posts = random.sample(sick_posts, 10000)
json_string2 = json.dumps(sampled_sick_posts, default=np_encoder)

with open('cse557_option1_sick_microblogs_sampled.json', 'w') as f:
    json.dump(json_string2, f)


# json_string2.to_json('cse557_option1_sick_microblogs_sampled.json')



# need to try and filter this so that it only has tweets from sick people

