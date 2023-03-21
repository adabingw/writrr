import cv2 
import numpy as np
import matplotlib.pyplot as plt 
import tensorflow as tf
import opencv 
import tensorflow_datasets as tfds
# from extra_keras_datasets import emnist
# from emnist import extract_training_samples, extract_test_samples

data = tf.keras.datasets.mnist 
(x_train, y_train), (x_test, y_test) = data.load_data()
x_train = tf.keras.utils.normalize(x_train, axis = 1)
x_test = tf.keras.utils.normalize(x_test, axis = 1)

(img_train, label_train), (img_test, label_test) = tfds.as_numpy(tfds.load(
    'emnist',
    split=['train', 'test'],
    batch_size=-1,
    as_supervised=True,
))

# from extra_keras_datasets import emnist 
# (input_train, target_train), (input_test, target_test) = emnist.load_data(type='balanced')
# input_train = input_train.reshape(-1, 28*28)
# input_train = input_train.astype('float32') / 255 
# target_train = tf.keras.utils.to_categorical(target_train , num_classes=62)
# input_train = tf.keras.utils.normalize(input_train, axis = 1)
# input_test = tf.keras.utils.normalize(input_test, axis = 1)
# x_train, y_train = extract_training_samples('byclass')
# x_test, y_test = extract_test_samples('byclass')
# x_train = tf.keras.utils.normalize(x_train, axis = 1)
# x_test = tf.keras.utils.normalize(x_test, axis = 1)

# from emnist import extract_training_samples, extract_test_samples
# train_ds, test_ds = tfds.load('emnist', split=['train', 'test'], shuffle_files=True)
# x_train = train_ds.map(lambda i: i['image'])
# y_train = train_ds.map(lambda l: l['label'])
# x_test = test_ds.map(lambda x: x['image'])
# y_test = test_ds.map(lambda y: y['label'])
# x_train = np.array(list(train_ds.map(lambda i: i['image'])))
# y_train = np.array(list(train_ds.map(lambda l: l['label'])))
# x_test = np.array(list(test_ds.map(lambda x: x['image'])))
# y_test = np.array(list(test_ds.map(lambda y: y['label'])))
# x_train = tf.keras.utils.normalize(x_train, axis = 1)
# y_train = tf.keras.utils.normalize(y_train, axis = 1)

def train():
    model = tf.keras.models.Sequential()
    model.add(tf.keras.layers.Conv2D(32, (3,3), input_shape=(28, 28, 1), activation='relu'))
    model.add(tf.keras.layers.MaxPool2D(2,2))
    model.add(tf.keras.layers.BatchNormalization())
    model.add(tf.keras.layers.Flatten())
    model.add(tf.keras.layers.Dense(512, activation='relu'))
    model.add(tf.keras.layers.Dense(256, activation='relu'))
    model.add(tf.keras.layers.Dense(128, activation='relu'))
    # model.add(tf.keras.layers.Dense(62, activation='softmax'))
    model.add(tf.keras.layers.Dense(10, activation='softmax'))

    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    model.fit(x_train, y_train, epochs=8) 

    # model.fit(img_train, label_train, epochs=8) 

    # print(model.summary())
    model.save('writrr.model')

def evaluate():

    model = tf.keras.models.load_model('writrr.model')
    # loss, accuracy = model.evaluate(img_train, label_train) 
    loss, accuracy = model.evaluate(x_test, y_test) 
    print(loss, accuracy)
    
def pred(path): 
    
    img = opencv.remove_whitespace(path)
    img = cv2.imread(path)[:, :, 0]
    img = cv2.resize(img, (28, 28))
    img = cv2.bitwise_not(img)
    # img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
    # img = cv2.flip(img, 0)
    
    cv2.imshow("img", img)
    cv2.waitKey(0)

    img = np.array([img])
        
    model = tf.keras.models.load_model('writrr.model')
    prediction = model.predict(img)
    print("The predicted value is : ", prediction)
    classes = np.argmax(prediction,axis=1)
    print("Predicted class: ", classes)

    # print(np.argmax(prediction))
    return np.argmax(prediction[0])