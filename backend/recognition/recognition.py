import numpy as np
import sys
import tensorflow as tf

# Check command-line arguments
if len(sys.argv) != 2:
    sys.exit("Usage: python recognition.py model")
model = tf.keras.models.load_model(sys.argv[1])

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)


OFFSET = 20
CELL_SIZE = 10

classification = None

while True:

    
    
    # Generate classification
    classification = model.predict(
        [np.array(handwriting).reshape(1, 28, 28, 1)]
    ).argmax()

    # Show classification if one exists
    if classification is not None:
        print("cannot classify :c")
