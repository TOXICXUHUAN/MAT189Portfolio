from turtle import *
from random import *
from PIL import Image
import os

SEED = 5420
seed(SEED)

def load_images(image_folder):
    images = []
    for filename in os.listdir(image_folder):
        if filename.endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            img = Image.open(os.path.join(image_folder, filename))
            images.append(img)
    return images

def random_crop(image):
    img_width, img_height = image.size
    crop_width = randint(0, img_width)
    crop_height = randint(0, img_height)
    left = img_width - crop_width
    top = img_height - crop_height
    right = left + crop_width
    bottom = top + crop_height
    return image.crop((left, top, right, bottom))


def create_collage(images, final_width, final_height):
    collage = Image.new('RGB', (final_width, final_height), (255, 255, 255))
    
    for img in images:
        img_crop = random_crop(img)
        img_width, img_height = img_crop.size
        max_x = final_width - img_width
        max_y = final_height - img_height
        
        if max_x < 0 or max_y < 0:
            continue

        x = randint(0, max_x)
        y = randint(0, max_y)
        collage.paste(img_crop, (x, y))
    
    return collage

def function_list(arg, max_width, max_length):
    match arg:
        case 0:
            # line
            randomx = randint(0, max_width) - max_width/2
            randomy = randint(0, max_length) - max_length/2
            goto(randomx, randomy)
        case 1:
            # circle
            circle(randint(50,300))
        case 2:
            # rectangle
            width = randint(50, 300)
            length = randint(50, 300)
            forward(width)
            right(90)
            forward(length)
            right(90)
            forward(width)
            right(90)
            forward(length)
        case 3:
            # rotate
            right(random()*360)
        case 4:
            # triangle
            width = randint(50, 300)
            length = randint(50, 300)
            forward(width)
            left(120)
            forward(length)
            left(120)
            forward(width)


def main():
    image_folder = "C:/Users/yiyuc/Downloads/Artwork_folder"
    final_width = 2000
    final_height = 2000
    
    images = load_images(image_folder)
    collage = create_collage(images, final_width, final_height)
    collage.show()
    collage.save("C:/Users/yiyuc/Downloads/Outputs_folder/result.gif")
    # turtle

    screen = Screen()
    screen.setup(final_width, final_height, startx=1, starty=1)
    screen.bgpic("C:/Users/yiyuc/Downloads/Outputs_folder/result.gif")
    screen.colormode(255)
    speed('fastest')
    hideturtle()

    for i in range(100):
        mode = randint(0, 4)
        function_list(mode, final_width, final_height)

    getcanvas().postscript(file="C:/Users/yiyuc/Downloads/Outputs_folder/turtleoutput.ps", height = final_height, width = final_width, x = -final_width/2, y = -final_height/2)
    turtle_output = Image.open("C:/Users/yiyuc/Downloads/Outputs_folder/turtleoutput.ps")
    turtle_output.show()
    turtle_output.save("C:/Users/yiyuc/Downloads/Outputs_folder/turtleoutput.png")
    input("press enter to end")

if __name__ == '__main__':
    main()