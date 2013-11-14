import sys
import time
import Image
from flask import Flask, Response, jsonify,request
from capture import Screenshot
from subprocess import call
import hashlib
import urllib

app=Flask(__name__)



users={}
root='localhost:4000'



@app.route('/image', methods=['GET','POST'])
def getPicture():
    #reading args
    print str(request.args)
    url=request.args.get('url')
    screenWidth=request.args.get('screenwidth')
    top=request.args.get('top')
    left=request.args.get('left')
    width=request.args.get('width')
    height=request.args.get('height')
    filename=hashlib.sha1(url+screenWidth+top+left+width+height).hexdigest()
    call(["python","capture.py",url,screenWidth,top,left,width,height,filename])
    call(["mv",filename+".png","../server/public/images/"])
    return filename+".png"


@app.route('/')
def api_root():
    return 'Welcome'


if __name__=='__main__':
    app.run(host='localhost',port=4000,debug=True)

