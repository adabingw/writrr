import cv2 as cv
import numpy as np
import random
import os 

def remove_whitespace(filepath): 
    img = cv.imread(filepath) # Read in the image and convert to grayscale
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    gray = 255*(gray < 128).astype(np.uint8) # To invert the text to white
    coords = cv.findNonZero(gray) # Find all non-zero points (text)
    x, y, w, h = cv.boundingRect(coords) # Find minimum spanning bounding box
    rect = img[y:y+h, x:x+w] # Crop the image - note we do this on the original image
    # cv.imshow("Cropped", rect) # Show it
    cv.waitKey(0)
    cv.destroyAllWindows()
    cv.imwrite(filepath, rect) # Save the image

def draw(filepath, index, symbol): 
    img = cv.imread(filepath)
    canny = cv.Canny(img, 125, 175)
    contours, hierarchy = cv.findContours(canny, cv.RETR_LIST, cv.CHAIN_APPROX_NONE)

    blank = np.zeros((500, 500, 3), dtype = "uint8")
    cv.drawContours(blank, contours, -1, (0,0,255), 1)

    nh, nw = img.shape[:2]

    PI = 3.141592653589793
    phase_random = random.randint(1,10)
    omega_random = random.randint(4, 9)
    phase = -1 * phase_random * PI
    omega = omega_random * PI / nw
    amp = 15

    xs, ys = np.meshgrid(np.arange(0, nw), np.arange(0, nh))
    ys = np.sin(phase+xs*omega)*amp + ys
    xs = np.float32(xs)
    ys = np.float32(ys)

    dst = cv.remap(img, xs, ys, cv.INTER_CUBIC)
    height, width, channels = dst.shape 
    crop_img = dst[15:height-15, 0:width]
    
    # cv.imwrite("cv_img/diff.png", dst)
    path = "cv_img/{}_{}.png".format(index, symbol)
    cv.imwrite(path, crop_img) 
        
    remove_whitespace(path) 
    
    # crop_img = cv.imread("cv_img/cropped.png")
    # for testing 
    # cv.imshow("cropped", crop_img)
    # cv.imshow("changed", dst)
    # cv.imshow("original", img)
    # cv.waitKey(0) 

def generate(dir): 
    images = cv.imread("white.png")
    images = cv.resize(images, (128, 128))
    for file in os.listdir(dir):
        print(file)
        path = os.path.join(dir, file)
        print(path)
        img = cv.imread(path)
        img = cv.resize(img, (128, 128))
        images = np.concatenate((images, img), axis=1)
    margin = cv.imread("white.png")
    margin = cv.resize(margin, (128, 128)) 
    images = np.concatenate((images, margin), axis = 1)
    cv.imwrite("cv_img/result.png", images)
    cv.imwrite("../frontend/src/images/result.png", images)
    # cv.imshow("images", images)
    # cv.waitKey(0)
    
if __name__ == '__main__':
    # draw("./img/alpha_A0.png")
    generate("cv_img/")