import cv2 as cv
import numpy as np
import random
import os 

trees = ['b', 'd', 'f', 'h', 'k', 'l', 't']
roots = ['g', 'j', 'p', 'q', 'y']

def remove_whitespace(filepath): 
    img = cv.imread(filepath) # Read in the image and convert to grayscale
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    gray = 255*(gray < 128).astype(np.uint8) # To invert the text to white
    coords = cv.findNonZero(gray) # Find all non-zero points (text)
    x, y, w, h = cv.boundingRect(coords) # Find minimum spanning bounding box
    rect = img[y:y+h, x:x+w] # Crop the image - note we do this on the original image
    cv.waitKey(0)
    cv.destroyAllWindows()
    cv.imwrite(filepath, rect) # Save the image
    
def image_resize(image, width = None, height = None, inter = cv.INTER_AREA):
    # initialize the dimensions of the image to be resized and
    # grab the image size
    dim = None
    (h, w) = image.shape[:2]

    # if both the width and height are None, then return the
    # original image
    if width is None and height is None:
        return image

    # check to see if the width is None
    if width is None:
        # calculate the ratio of the height and construct the
        # dimensions
        r = height / float(h)
        dim = (int(w * r), height)

    # otherwise, the height is None
    else:
        # calculate the ratio of the width and construct the
        # dimensions
        r = width / float(w)
        dim = (width, int(h * r))

    # resize the image
    resized = cv.resize(image, dim, interpolation = inter)

    # return the resized image
    return resized

def draw(filepath, index, symbol, size): 
    size = 64

    # check for characters not in our alphabet and use 🗿
    if(os.path.exists(filepath) is False):
        moyai = cv.imread("moyai.jpg")
        path = "cv_img/{}.png".format(index)
        cv.imwrite(path, moyai)
    else: 
        
        # draw our letter on a blank canvas
        img = cv.imread(filepath)
        canny = cv.Canny(img, 125, 175)
        contours, hierarchy = cv.findContours(canny, cv.RETR_LIST, cv.CHAIN_APPROX_NONE)
        blank = np.zeros((500, 500, 3), dtype = "uint8")
        cv.drawContours(blank, contours, -1, (0,0,255), 1)

        # image convolusion 
        nh, nw = img.shape[:2]
        PI = 3.141592653589793
        phase_random = random.randint(1,5)
        omega_random = random.randint(4, 7)
        phase = -1 * phase_random * PI
        omega = omega_random * PI / nw
        amp = 15

        xs, ys = np.meshgrid(np.arange(0, nw), np.arange(0, nh))
        ys = np.sin(phase+xs*omega)*amp + ys
        xs = np.float32(xs)
        ys = np.float32(ys)

        dst = cv.remap(img, xs, ys, cv.INTER_CUBIC)
        height, width, channels = dst.shape
        
        # crop the image to get rid of the wavy part
        crop_img = dst[15:height-15, 0:width]
        path = "cv_img/{}.png".format(index)
        cv.imwrite(path, crop_img) 
            
        remove_whitespace(path)
        
        block_top = cv.imread("block.png") 
        block_bottom = cv.imread("block.png")
        
        img = cv.imread(path)
        img = image_resize(img, height = 128)
        h, w, c = img.shape

        # padding at the edges for some letters so they don't get too stretched        
        if (w < size / 1.5):
            back = cv.imread('block.png')
            back = cv.resize(back, (size, 128))
            hh, ww, cc = back.shape

            yoff = round((hh-h)/2)
            xoff = round((ww-w)/2)

            back[yoff:yoff+h, xoff:xoff+w] = img
            
            cv.imwrite(path, back)
            img = cv.imread(path)
        
        # tweaking images for the tree and root parts of the letter
        if symbol.isupper() or symbol in trees: 
            print(symbol, " is upper or tree")
            img = cv.resize(img, (size, 256))
            block_bottom = cv.resize(block_bottom, (size, 128))
            images = np.concatenate((img, block_bottom), axis = 0)
            images = cv.detailEnhance(images, sigma_s=10, sigma_r=0.15)
            cv.imwrite(path, images)          
        elif symbol in roots: 
            print(symbol, " is in roots")
            img = cv.resize(img, (size, 256))
            block_top = cv.resize(block_bottom, (size, 128))
            images = np.concatenate((block_top, img), axis = 0)
            images = cv.detailEnhance(images, sigma_s=10, sigma_r=0.15)
            cv.imwrite(path, images)      
        else: 
            img = cv.resize(img, (size, 128))
            block_top = cv.resize(block_top, (size, 128))
            block_bottom = cv.resize(block_bottom, (size, 128))
            images = np.concatenate((block_top, img), axis = 0)
            images = np.concatenate((images, block_bottom), axis = 0)
            images = cv.detailEnhance(images, sigma_s=10, sigma_r=0.15)
            cv.imwrite(path, images)            

def generate(dir): 
    images = cv.imread("white.png")
    images = cv.resize(images, (40, 128))
    file_list = os.listdir(dir) 
    list_size = len(file_list)
    
    # if we iterate file in dir, then 10.png would appear before 1.png
    for i in range(0, list_size): 
        file = "{}.png".format(i)
        path = os.path.join(dir, file)
        img = cv.imread(path)
        img = cv.resize(img, (40, 128))
        images = np.concatenate((images, img), axis=1)

    margin = cv.imread("white.png")
    margin = cv.resize(margin, (40, 128)) 
    images = np.concatenate((images, margin), axis = 1)
    cv.imwrite("../frontend/src/images/result.png", images)
    
if __name__ == '__main__':
    generate("cv_img/")