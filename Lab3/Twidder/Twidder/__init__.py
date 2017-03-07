__author__ = 'salsa083'


from gevent.wsgi import WSGIServer

from gevent import pywsgi
from  geventwebsocket.handler import WebSocketHandler

from server import app
if __name__ == "__main__":


    app.debug = True;
    http_server = pywsgi.WSGIServer(('', 5031), app,
                                    handler_class=WebSocketHandler)
    http_server.serve_forever()
    '''
    Funkar men ger oss kommentarer nar vi stanger ner, och ingen address som tidigare
    '''

    '''
    app.debug = True
    app.run(port = 5022)
    '''



