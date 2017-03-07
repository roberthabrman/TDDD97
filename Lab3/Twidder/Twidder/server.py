import json
import random
import websocket
import hashlib
from flask import Flask
from flask import request


from flask_bcrypt import Bcrypt

from Twidder.Twidder import database_helper




from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler

from gevent.wsgi import WSGIServer

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['DEBUG'] = True


websockets = {}

@app.route("/")
def root():
    return app.send_static_file('client.html')










@app.route("/websocket")
def ourwebsocket():

        try:
            if request.environ.get("wsgi.websocket"):

                ws=request.environ["wsgi.websocket"]

                while(True):




                    token = ws.receive()





                    if database_helper.GetLoggedInUserToken(token) == None:
                        #del websockets[email]
                        ws.send(json.dumps({"success": True, "message": "You are signed in. And other one is loggedout", "Data":"logout"}))


                    else:

                        user = database_helper.GetLoggedInUserToken(token)
                        email = user[0]
                        websockets[email] = ws
                        ws.send(json.dumps({"success": True, "message": "You are signed in and socket ok.", "Data":"login"}))
            else:
                print("No websocket request")

        except websocket.error():
            print("Bad")
            return ""







#Security measures lab 4 not needed for signin since it goes under "authentication"
@app.route("/signin", methods=['POST'])
def sign_in():






    email = request.form['email'];
    password = request.form['password'];

    FoundUser = database_helper.GetUser(email)

    if FoundUser is not None:


        token = random.getrandbits(30)
        userinfo = database_helper.GetUser(email)
        realpassword = userinfo[1]




        #if realpassword == password:
        if bcrypt.check_password_hash(realpassword,password):






            if email in websockets:


                database_helper.DeleteLoggedInUserEmail(email)

                try:#since the socket is already dead we cant send anything to it, therefor we need a try catch incase of a update in the old session
                    websockets[email].send(json.dumps({"success": True, "message": "You are being logged out", "data": "logout"}))
                    del websockets[email]
                except:
                    print "error..."

                database_helper.SetLoggedInUserToken(email,token)


                return json.dumps ({"success": True, "message": "You are signed in", "data": token})



            database_helper.SetLoggedInUserToken(email ,token)
            return json.dumps ({"success": True, "message": "Successfully signed in.", "data": token})
        else:
            return json.dumps ({"success": False, "message": "Wrong username or password."})

    else:
        print 'User not found'
        return json.dumps ({"success": False, "message": "Wrong username or password."})







#Security measures lab 4 not needed for signup since it goes under "authentication"
@app.route("/signup", methods=['POST'])
def sign_up():
    email = request.form['email']
    password = request.form['password']
    firstname = request.form['firstname']
    familyname = request.form['familyname']
    gender = request.form['gender']
    city = request.form['city']
    country = request.form['country']





    if database_helper.GetUser(email) == None:


        pw_hash = bcrypt.generate_password_hash(password)


        database_helper.AddUser(email,pw_hash,firstname,familyname,gender,city,country)
        return json.dumps({"success": True, "message": "Successfully created a new user."})
    else:

        return json.dumps({"success": False, "message": "User already exists."})






@app.route("/signout", methods=['POST'])#SHA hash works
def sign_out():


    email = request.form['email']
    hashclient = request.form['hash']


    tempone = database_helper.GetLoggedInUserEmail(email)


    if not tempone:

        return json.dumps({"success": False, "message": "You are not logged in."})

    else:

        token = tempone[1]
        hashserver = hashlib.sha256(token+email).hexdigest()



        if hashclient == hashserver:
            database_helper.DeleteLoggedInUserToken(token)
            del websockets[email]
            return json.dumps({"success": True, "message": "Successfully signed out."})
        else:
            return json.dumps({"success": False, "message": "Wrong hash"})





@app.route("/changepassword", methods=['POST'])#SHA hash works
def change_password():


    #g = hashlib.sha256('Bullar').hexdigest()
    #print(g)


    #new
    oldpassword = request.form['oldpassword']
    newpassword = request.form['newpassword']
    email = request.form['email']
    hashclient = request.form['hash']


    tempone = database_helper.GetLoggedInUserEmail(email)


    if not tempone:

        return json.dumps({"success": False, "message": "You are not logged in."})

    else:
        token = tempone[1]
        hashserver = hashlib.sha256(email+oldpassword+newpassword+token).hexdigest()




        if hashserver == hashclient:
            #they are correct

            email = database_helper.GetLoggedInUserToken(token)[0]

            currentpassword = database_helper.GetUser(email)[1]

            if bcrypt.check_password_hash(currentpassword,oldpassword):

                pw_hash = bcrypt.generate_password_hash(newpassword)
                database_helper.SetPassword(email,pw_hash)
                return json.dumps({"success": True, "message": "Password changed."})
            else:
                print("debugg2")
                return json.dumps({"success": False, "message": "Wrong password."})

        else:
            print("debugg1")
            return json.dumps({"success": False, "message": "Wrong password"})






@app.route("/getuserdatabytoken/<email>/<hash>", methods=['GET'])
def get_user_data_by_token(email=None,hash=None):#SHA hash works



    temp = database_helper.GetLoggedInUserEmail(email)

    if not temp:
        return json.dumps({"success": False, "message": "You are not signed in."})
    else:
        token = temp[1]
        serverhash = hashlib.sha256(email+token).hexdigest()

        if hash == serverhash:

            user = database_helper.GetUser(email)

            if not user:
                return json.dumps({"success": False, "message": "No such user."})
            else:
                return json.dumps({"success": True, "message": "User data retrieved.", 'data': user})

        else:
            return json.dumps({"success": False, "message": "Wrong hash"})






@app.route("/getuserdatabyemail/<email>/<searchedemail>/<hash>", methods=['GET'])
def get_user_data_by_email(email=None,searchedemail=None,hash=None):



    toemail = searchedemail;

    temp = database_helper.GetLoggedInUserEmail(email)
    if not temp:
        return json.dumps({"success": False, "message": "You are not signed in."})
    else:
        token = temp[1]
        hashserver = hashlib.sha256(email+searchedemail+token).hexdigest()

        if hash == hashserver:
            found = database_helper.GetUser(toemail)
            if not found:
                return json.dumps({"success": False, "message": "No such user."})
            else:
                return json.dumps({"success": True, "message": "User data retrieved.", 'data': found})
        else:
            return json.dumps({"success": False, "message": "Wrong hash."})








@app.route("/getusermessagebytoken/<email>/<hash>", methods=['GET'])
def get_user_message_by_token(email= None,hash = None):


    temp = database_helper.GetLoggedInUserEmail(email)

    if not temp:
        return json.dumps({"success": False, "message": "You are not signed in."})
    else:
        token = temp[1]
        serverhash = hashlib.sha256(email+token).hexdigest()
        if serverhash == hash:

            message = database_helper.GetUserMessage(email)
            if not message:
                empty=""
                return json.dumps({"success": True, "message": "User messages retrieved. But there are no messages", 'data': empty})

            else:
                return json.dumps({"success": True, "message": "User messages retrieved.", 'data': message})
        else:
            return json.dumps({"success": False, "message": "Wrong hash"})









@app.route("/getusermessagebyemail/<email>/<searchedemail>/<hash>", methods=['GET'])
def get_user_message_by_email(email=None,searchedemail=None,hash=None):

    toemail = searchedemail




    temp = database_helper.GetLoggedInUserEmail(email)

    if not temp:
        return json.dumps({"success": False, "message": "You are not signed in."})
    else:
        token = temp[1]


        serverhash = hashlib.sha256(email+searchedemail+token).hexdigest()

        if serverhash == hash:



            searcheduser = database_helper.GetUser(toemail)
            if not searcheduser:
                return json.dumps({"success": False, "message": "No such user."})
            else:

                message = database_helper.GetUserMessage(toemail)
                if not message:
                    empty=""
                    return json.dumps({"success": True, "message": "User messages retrieved. But there are no messages", 'data': empty})

                else:
                    return json.dumps({"success": True, "message": "User messages retrieved.", 'data': message})



        else:
            return json.dumps({"success": False, "message": "Wrong hash"})









@app.route("/postmessage", methods=['POST'])
def post_message():

    email = request.form['email']
    toemail = request.form ['toemail']
    message = request.form['message']
    clienthash = request.form['hash']


    temp = database_helper.GetLoggedInUserEmail(email)


    if not temp:
        return json.dumps({"success": False, "message": "You are not signed in."})
    else:
        token = temp[1]
        serverhash = hashlib.sha256(email+toemail+message+token).hexdigest()

        if clienthash==serverhash:

            if database_helper.GetUser(toemail) != None:

                database_helper.AddUserMessage(email,toemail,message)
                return json.dumps({"success": True, "message": "Message posted."})

            else:
                return json.dumps({"success": False, "message": "No such user."})

        else:
            return json.dumps({"success": False, "message": "Wrong hash"})







if __name__ == "__main__":

    app.debug = True;
    http_server = pywsgi.WSGIServer(('', 5031), app,
                                    handler_class=WebSocketHandler)
    http_server.serve_forever()


    '''
    app.debug = True
    app.run(port = 5022)
    '''



























