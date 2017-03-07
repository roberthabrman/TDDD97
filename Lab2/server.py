
from flask import Flask
from flask import request
import database_helper
import json
import random

app = Flask(__name__)
app.config['DEBUG'] = True


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/signin", methods=['POST'])
def sign_in():

    email = request.form['email'];
    password = request.form['password'];
    FoundUser = database_helper.GetUser(email)

    if FoundUser != None:

        print 'USER found'
        token = random.getrandbits(30)
        userinfo = database_helper.GetUser(email)
        realpassword = userinfo[1]



        if realpassword == password:
            database_helper.SetLoggedInUserToken(email , token)
            return json.dumps ({"success": True, "message": "Successfully signed in.", "data": token})
        else:
            return json.dumps ({"success": False, "message": "Wrong username or password."})

    else:
        print 'User not found'
        return json.dumps ({"success": False, "message": "Wrong username or password."})




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
        print 'user can be added'
        database_helper.AddUser(email,password,firstname,familyname,gender,city,country)
        return json.dumps({"success": True, "message": "Successfully created a new user."})
    else:
        print 'user alredy exists'
        return json.dumps({"success": False, "message": "User already exists."})






@app.route("/signout", methods=['POST'])
def sign_out():
    token = request.form['token']

    if database_helper.GetLoggedInUserToken(token) != None:
        database_helper.DeleteLoggedInUserToken(token)
        return json.dumps({"success": True, "message": "Successfully signed out."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})





@app.route("/changepassword", methods=['POST'])
def change_password():
    token = request.form['token']
    oldpassword = request.form['oldpassword']
    newpassword = request.form['newpassword']



    temp = database_helper.GetLoggedInUserToken(token)

    if not temp:
        return json.dumps({"success": False, "message": "You are not logged in."})

    else:

        temp = database_helper.GetLoggedInUserToken(token)[0]
        email = temp[0]
        currentpassword = database_helper.GetUser(email)[1]

        if oldpassword == currentpassword:
            database_helper.SetPassword(email,newpassword)
            return json.dumps({"success": True, "message": "Password changed."})
        else:

            return json.dumps({"success": False, "message": "wrong password."})




@app.route("/getuserdatabytoken/", methods=['GET'])
def get_user_data_by_token():


    token = request.args.get('token')


    loggedin = database_helper.GetLoggedInUserToken(token)


    if not loggedin:
        return json.dumps({"success": False, "message": "You are not signed in."})
    else:

        temp = database_helper.GetLoggedInUserToken(token)[0]
        email = temp[0]

        user = database_helper.GetUser(email)
        if not user:
            return json.dumps({"success": False, "message": "No such user."})
        else:

            return json.dumps({"success": True, "message": "User data retrieved.", 'data': user})



@app.route("/getuserdatabyemail/", methods=['GET'])
def get_user_data_by_email():



    token = request.args.get('token')

    toemail = request.args.get('email')


    fromemail = database_helper.GetLoggedInUserToken(token)


    if not fromemail:
        return json.dumps({"success": False, "message": "You are not signed in."})


    else:

        toemail = database_helper.GetUser(toemail)
        if not toemail:
            return json.dumps({"success": False, "message": "No such user."})
        else:

            return json.dumps({"success": True, "message": "User data retrieved.", 'data': toemail})







@app.route("/getusermessagebytoken/", methods=['GET'])
def get_user_message_by_token():

    token = request.args.get('token')

    temp = database_helper.GetLoggedInUserToken(token)

    if not temp:
        return json.dumps({"success": False, "message": "You are not signed in."})
    else:
        temp = database_helper.GetLoggedInUserToken(token)[0]
        email = temp[0]
        message = database_helper.GetUserMessage(email)

        if not message:
            empty=""
            return json.dumps({"success": True, "message": "User messages retrieved. But there are no messages", 'data': empty})

        else:
            return json.dumps({"success": True, "message": "User messages retrieved.", 'data': message})






@app.route("/getusermessagebyemail/", methods=['GET'])
def get_user_message_by_email():



    token = request.args.get('token')

    toemail = request.args.get('email')



    user = database_helper.GetLoggedInUserToken(token)

    if not user:
        return json.dumps({"success": False, "message": "You are not signed in."})
    else:


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





@app.route("/postmessage", methods=['POST'])
def post_message():
    toemail = request.form ['email']
    token = request.form['token']
    message = request.form['message']

    temp = database_helper.GetLoggedInUserToken(token)


    if not temp:
        return json.dumps({"success": False, "message": "You are not signed in."})

    else:



        temp = database_helper.GetLoggedInUserToken(token)[0]
        fromemail = temp[0]

        if database_helper.GetUser(toemail) != None:


            database_helper.AddUserMessage(fromemail,toemail,message)
            return json.dumps({"success": True, "message": "Message posted."})

        else:
            return json.dumps({"success": False, "message": "No such user."})












if __name__ == "__main__":

    app.run(port = 5000)





















