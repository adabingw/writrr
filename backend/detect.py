import cv2 
import numpy as np
import matplotlib.pyplot as plt 
import tensorflow as tf
from extra_keras_datasets import emnist

# data = tf.keras.datasets.mnist 
# (x_train, y_train), (x_test, y_test) = data.load_data()

# x_train = tf.keras.utils.normalize(x_train, axis = 1)
# x_test = tf.keras.utils.normalize(x_test, axis = 1)

(input_train, target_train), (input_test, target_test) = emnist.load_data(type='balanced')

# input_train = input_train.reshape(-1, 28*28)
# input_train = input_train.astype('float32') / 255

# # train set / target 
# target_train = tf.keras.utils.to_categorical(target_train , num_classes=62)

input_train = tf.keras.utils.normalize(input_train, axis = 1) 
input_test = tf.keras.utils.normalize(input_test, axis = 1)

def train():

    model = tf.keras.models.Sequential()
    model.add(tf.keras.layers.Flatten(input_shape=(28, 28)))
    model.add(tf.keras.layers.Dense(256, activation='relu'))
    model.add(tf.keras.layers.Dense(256, activation='relu'))
    model.add(tf.keras.layers.Dense(62, activation='softmax'))

    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    # model.fit(x_train, y_train, epochs=3) 
    model.fit(input_train, target_train, epochs = 20)

    model.save('writrr.model')

def evaluate():

    model = tf.keras.models.load_model('writrr.model')
    # loss, accuracy = model.evaluate(x_test, y_test) 
    loss, accuracy = model.evaluate(input_test, target_test)
    print(loss, accuracy)
    
def pred(path): 
    
    img = cv2.imread(path)[:, :, 0]
    img = cv2.resize(img, (28, 28))
    # cv2.imshow("img", img)
    # cv2.waitKey(0)
    img = cv2.bitwise_not(img)
    img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
    img = cv2.flip(img, 0)
    
    cv2.imshow("img", img)
    cv2.waitKey(0)

    img = np.invert(np.array([img]))
        
    model = tf.keras.models.load_model('writrr.model')
    prediction = model.predict(img)
    print(prediction)
    print(np.argmax(prediction))
    return np.argmax(prediction)