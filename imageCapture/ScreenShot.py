import sys
import time
import Image
from flask import Flask, Response, jsonify,request
from capture import Screenshot
from subprocess import call
import hashlib

app=Flask(__name__)


s=Screenshot()

@app.route('/image', methods=['GET','POST'])
def getPicture():
    #reading args
    print str(request.args)
    url=request.args.get('url')
    screenWidth=request.args.get('sw')
    top=request.args.get('top')
    left=request.args.get('left')
    width=request.args.get('width')
    height=request.args.get('height')
    filename=hashlib.sha1(url+screenWidth+top+left+width+height).hexdigest()+".png"
    call(["python","capture.py",url,screenWidth,top,left,width,height,filename])
    return filename


 
@app.route('/')
def api_root():
    return 'Welcome'


if __name__=='__main__':
    app.run(host='0.0.0.0',port=3000,debug=True)
    