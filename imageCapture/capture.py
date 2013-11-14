import sys
import time
from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import  *
import Image
from flask import Flask, Response, jsonify,request
app=Flask(__name__)


class Screenshot(QWebView):
    def __init__(self):
        self.app = QApplication(sys.argv)
        QWebView.__init__(self)
        self._loaded = False
        self.loadFinished.connect(self._loadFinished)

    def capture(self,url,width,output_file):
        self.resize(width,300)
        self.load(QUrl(url))
        self.wait_load()
        # set to webpage size
        frame = self.page().mainFrame()
        self.page().setViewportSize(frame.contentsSize())
        # render image
        image = QImage(self.page().viewportSize(), QImage.Format_ARGB32)
        painter = QPainter(image)
        frame.render(painter)
        painter.end()
        print 'saving', output_file
        image.save(output_file)

    def wait_load(self, delay=3):
        # process app events until page loaded
        tdel=0
        while not self._loaded and tdel < 30 :
            self.app.processEvents()
            time.sleep(delay)
            tdel += delay
        self._loaded = False

    def _loadFinished(self, result):
        self._loaded = True




def makePicture(url,screenWidth,top,left,width,height,output):
    s=Screenshot()
    screenWidth=int(screenWidth)
    top=int(top)
    left=int(left)
    width=int(width)
    height=int(height)
    s.capture(url,screenWidth,"temp.png")
    img=Image.open("temp.png")
    box=(left, top, left+width, top+height)
    area=img.crop(box)
    area.save(output,"png")

if __name__ == '__main__':
    makePicture(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6],sys.argv[7])