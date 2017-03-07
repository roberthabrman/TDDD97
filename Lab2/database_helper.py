import sqlite3
from flask import g



def connect_db ():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    return sqlite3.connect("database.db")



def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'database_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db





def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'database.db'):
        g.sqlite_db.close()


def init_db(app):
    db = get_db()
    with app.open_resource('database.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()






#to initiate db, do it trough the terminal using sqlite3 database.db < database.sql in the directory of the project


def query_db(query, args=(), one=False):
    database= get_db()
    cur = database.execute(query, args)
    rv = cur.fetchall()
    database.commit()
    cur.close()
    return (rv[0] if rv else None) if one else rv





def AddUser(email, password, firstname, familyname, gender, city, country):
    user = query_db('INSERT INTO user VALUES (?, ?, ?, ?, ?, ?, ?)',[email, password, firstname, familyname, gender, city, country])
    print user
    return


def GetUser(email):
    user = query_db('SELECT * FROM user WHERE user.email = (?)',[email],one=True)
    return (user)



def GetLoggedInUserToken(token):
    user = query_db('SELECT * FROM loggedinusers WHERE loggedinusers.token = (?)',[token])
    return (user)


def GetLoggedInUserEmail(email):
    user = query_db('SELECT * FROM loggedinusers WHERE loggedinusers.email = (?)',[email],one=True)
    return (user)

def SetLoggedInUserToken(email, token):
    query_db('INSERT INTO loggedinusers VALUES (?,?)',[email, token])
    return

def DeleteLoggedInUserToken(token):
    query_db('Delete FROM loggedinusers WHERE loggedinusers.token = (?)', [token])
    return

def SetPassword(email , password):
    query_db('UPDATE user SET password =? WHERE email = ?', [password , email])
    return


def AddUserMessage(fromuseremail, touseremail, message):
    query_db('INSERT INTO messages (message,fromuseremail,touseremail) values (?,?,?)', [message, fromuseremail, touseremail])
    return

def GetUserMessage(email):
    allmessages = query_db('SELECT * FROM messages WHERE messages.touseremail = (?)', [email])
    return allmessages

























