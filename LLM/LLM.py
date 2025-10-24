from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
#import pandas as pd
import numpy as np

def prognoz(days_arr:list[int], product_arr:list[int])->int:
    #считать данные: текущее количество товара и изменения в его количестве
    #df = pd.DataFrame(sclad)

    #обучаем модель пока её точность не будет выше 0.6
    accur = 0
    while accur < 0.6:
        model = LinearRegression()
        product_arr_train, product_arr_test, days_arr_train, days_arr_test = train_test_split(product_arr, days_arr, test_size=0.2)
        model.fit(days_arr_train, product_arr_train)
        accur = model.score(days_arr_test, product_arr_test) > 0.6

    return int(product_arr[-1] // abs(model.coef_[0]))

#создать массивы количество товара и времени
days_arr = np.array([1, 2, 3, 4, 5, 6, 7, 8]).reshape(-1, 1) 
product_arr = np.array([20, 18, 16, 14, 12, 10, 8, 6])

print(prognoz(days_arr, product_arr))

#удалить
'''
    plt.plot(days_arr, product_arr)
    plt.show()
    plt.xlabel("Кол-во товара")
    plt.ylabel("День")
'''