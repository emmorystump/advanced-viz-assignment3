import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import math
import statistics
from scipy import stats
import statsmodels.api as sm

microblogs_data = pd.read_pickle('cse_557_option1/cse557_option1_microblogs.pkl')
microblogs_data.to_json('cse_557_option1/cse557_option1_microblogs.json')

# need to try and filter this so that it only has tweets from sick people

print(microblogs_data)