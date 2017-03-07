window.onload = function(){


    loadview();
};


function loadview()
{

	if(localStorage.getItem("data")=="" || localStorage.getItem("data")==null)
	{
		document.getElementById("currentview").innerHTML = document.getElementById("welcomeview").innerHTML;

	}
	else
	{
		document.getElementById("currentview").innerHTML = document.getElementById("profileview").innerHTML;
		document.getElementById("defaultOpen").click();//vill öppna home direkt
		refreshwall();
        socket();//this is done here since we want to establish a new socket connection everytime the profileview is loaded
	}




}



function validateformone()//klar
{
    /*
    alert("du");
    hash = SHA256("kula");

    alert(hash);*/

	var email = document.forms["formone"]["email"].value;
	var password = document.forms["formone"]["password"].value;

	//Checking if filled in content is valid

	if(password.length<=6)
	{
		document.getElementById("loginmessage").innerHTML = "Password is to short";
		return false;
	}
	else
	{


        var allinfo="";
        allinfo += "email="+email+"&";
        allinfo += "password="+password;





        var con;
        con = new XMLHttpRequest();
        con.onreadystatechange = function () {

            if (con.readyState == 4 && con.status == 200)
            {
            //success
                var response = JSON.parse(con.responseText);


                if(response.success==true)
                {




                    localStorage.setItem("data",response.data);
                    localStorage.setItem("email",email)



                    //socket();

                    loadview();
                }
                if(response.success==false)
                 {
                    document.getElementById("loginmessage").innerHTML ="Wrong password or email";
                 }



            }




        };

        con.open("POST","/signin",true);
        con.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        con.send(allinfo);











	}

	return false;

};

function socket()
{




    var oursocket = new WebSocket("ws://127.0.0.1:5031/websocket");


    oursocket.onopen = function (event)
    {


        var token = localStorage.getItem("data");
        oursocket.send(token);

    };

    oursocket.onclose = function (event)
    {
        oursocket.close();
    }

    oursocket.onmessage = function (message)
    {
        console.log(message.data);
        var message = JSON.parse(message.data);


        if(message.success && message.data == "logout")
        {

            localStorage.setItem("data","");
            loadview();
            document.getElementById("loginmessage").innerHTML ="You have been logged out."
        }
    }

    oursocket.onerror = function (event)
    {

    }

}




function validateformtwo()//klar
{



	var firstname = document.forms["formtwo"]["firstname"].value;
	var familyname = document.forms["formtwo"]["familyname"].value;
    var e = document.getElementById("mygendermenu");

    var gender = e.options[e.selectedIndex].value;

	var city = document.forms["formtwo"]["city"].value;
	var country = document.forms["formtwo"]["country"].value;
	var email = document.forms["formtwo"]["email"].value;
	var password = document.forms["formtwo"]["password"].value;
	var passwordtwo = document.forms["formtwo"]["passwordtwo"].value;







	if(password.length<=6)
	{
		document.getElementById("loginmessage").innerHTML ="Please enter longer password";

		
	}
	else if(password!=passwordtwo)
	{
		document.getElementById("loginmessage").innerHTML ="Identical passswords needed";
		
	}
	else
	{




        var allinfo="";
        allinfo += "email="+email+"&";
        allinfo += "password="+password+"&";
        allinfo += "firstname="+firstname+"&";
        allinfo += "familyname="+familyname+"&";
        allinfo += "gender="+gender+"&";
        allinfo += "city="+city+"&";
        allinfo += "country="+country;


        var con;
        con = new XMLHttpRequest();
        con.onreadystatechange = function () {

            if (con.readyState == 4 && con.status == 200)
            {
            //success
                var response = JSON.parse(con.responseText);

                document.getElementById("loginmessage").innerHTML = response.message;
            }



        };


        con.open("POST","/signup",true);
        con.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        con.send(allinfo);





	}
    return false;



};


function openTab(evt, tabName) {


	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";

};





function changepass()//KLAR SHA256 hash works
{



	var oldpassword = document.forms["passwordchange"]["oldpassword"].value;
	var newpassword = document.forms["passwordchange"]["newpassword"].value;
	if(newpassword.length<=6)
	{
		document.getElementById("changepassinfo").innerHTML ="The new password has to be longer";

	}
	else
	{




        /*this is how we convert into SHA256
        alert("du");
        hash = SHA256("kula");
        alert(hash);
        */
        var token= localStorage.getItem("data").toString();
        var email = localStorage.getItem("email").toString();

        hash = SHA256(email + oldpassword + newpassword + token);

        /*gamla
        var allinfo = "";
        allinfo += "token="+token+"&";
        allinfo += "oldpassword="+oldpassword+"&";
        allinfo += "newpassword="+newpassword;
        */

        var allinfo = ""
        allinfo += "email="+email+"&";
        allinfo += "oldpassword="+oldpassword+"&";
        allinfo += "newpassword="+newpassword+"&";
        allinfo += "hash=" + hash;



        //before sending
        //email,oldpassword,newpassword,CryptoJS.SHA256(email,oldpw,newpw,token)
        /*

        //how to hash !??!?!?
        hash = CryptoJS.SHA256(email+oldpassword,newpassword,token)
        //we need to store email to localstorage when signed in(and take it away when signeout)
        var allinfo = "";
        allinfo += "email="+email+"&";
        allinfo += "oldpassword="+oldpassword+"&";
        allinfo += "newpassword="+newpassword+"&";
        allinfo += "hash=" + hash;


        */
        var con;
        con = new XMLHttpRequest();
        con.onreadystatechange = function () {

            if (con.readyState == 4 && con.status == 200)
            {
            //success
                var response = JSON.parse(con.responseText);


                if(response.success==true)
                {
                    document.getElementById("changepassinfo").innerHTML = response.message.toString();
                }
                else
                {
                    document.getElementById("changepassinfo").innerHTML = response.message.toString();
                }



            }




        };


        con.open("POST","/changepassword",true);
        con.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        con.send(allinfo);


    }

    return false;
};

function signout()//KLAR SHA256 hash works
{


        var token= localStorage.getItem("data").toString();



    //new
        var email = localStorage.getItem("email").toString();


        hash = SHA256(token+email);

        var allinfo = ""
        allinfo += "email="+email+"&";
        allinfo += "hash=" + hash;


        var con;
        con = new XMLHttpRequest();
        con.onreadystatechange = function () {

            if (con.readyState == 4 && con.status == 200)
            {

                var response = JSON.parse(con.responseText);


                if(response.success==true)
                {
                    localStorage.setItem("data","");
                    localStorage.setItem("email","");
                    loadview();
                }



            }




        };


        con.open("POST","/signout",true);
        con.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        con.send(allinfo);



};







function updatecontent()//klar SHA256 hash works
{



        var token = localStorage.getItem("data");


        var email = localStorage.getItem("email");

        hash = SHA256(email + token)




        var con;
        con = new XMLHttpRequest();
        con.onreadystatechange = function () {

            if (con.readyState == 4 && con.status == 200)
            {

                var response = JSON.parse(con.responseText);


                if(response.success==true)
                {
                    var info = response.data;

                    document.getElementById("firstname").innerHTML = info[2].toString();
                    document.getElementById("familyname").innerHTML = info[3].toString();
                    document.getElementById("gender").innerHTML = info[4].toString();
                    document.getElementById("city").innerHTML = info[5].toString();
                    document.getElementById("country").innerHTML = info[6].toString();
                    document.getElementById("email").innerHTML = info[0].toString();

                }



            }




        };


        con.open("GET","/getuserdatabytoken/"+email+"/"+hash,true);
        con.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        con.send();







return false;


};







function postmessage()//funkar SHA 256 hash working
{

        var token= localStorage.getItem("data");
        var email = localStorage.getItem("email");

        hash = SHA256(email + token)



        var con;
        con = new XMLHttpRequest();
        con.onreadystatechange = function () {

            if (con.readyState == 4 && con.status == 200)
            {

                var response = JSON.parse(con.responseText);


                if(response.success==true)
                {
                    info = response.data;


                    //var email = info[0];
                    var message = document.forms["messagesposter"]["message"].value.toString();
                    var toemail = info[0];


                    hash = SHA256(email + toemail + message + token)


                    var allinfo = "";
                    allinfo += "hash=" + hash + "&";
                    allinfo += "email=" + email + "&";
                    allinfo += "toemail=" + toemail + "&";
                    allinfo += "message=" + message;










                    var contwo;
                    contwo = new XMLHttpRequest();
                    contwo.onreadystatechange = function () {

                        if (contwo.readyState == 4 && contwo.status == 200) {

                            var response = JSON.parse(contwo.responseText);


                            if (response.success == true) {


                                refreshwall();

                            }


                        }


                    };


                    contwo.open("POST", "/postmessage", true);
                    contwo.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    contwo.send(allinfo);




                }
                else
                {
                    alert("Couldnt post message");
                    return false;
                }



            }




        };


        con.open("GET","/getuserdatabytoken/"+email+"/"+hash,true);
        con.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        con.send();



return  false;
};




function refreshwall()//funkar SHA 256 hash works
{


        /*
        var temp= localStorage.getItem("data");

        var token = "";
        token = temp;
        */
        var token = localStorage.getItem("data");
        var email = localStorage.getItem("email");


        hash = SHA256(email + token)













        var con;
        con = new XMLHttpRequest();
        con.onreadystatechange = function () {


            if (con.readyState == 4 && con.status == 200)
            {


                var response = JSON.parse(con.responseText);


                if(response.success==true)
                {


                    var data=response.data;
                    var row;


                    document.getElementById('wall').value="";
                    for(i =0;i<data.length;i++)
		            {


                        row=data[i];
                        for(c=3;c>=0;c--)
                        {


                            if(c==3)
                            {
                                document.getElementById('wall').value += 'To '+row[c];

                            }
                            if(c==2)
                            {
                                document.getElementById('wall').value += ' from '+row[c];
                            }
                            if(c==1)
                            {
                                document.getElementById('wall').value += ' message:'+ '\n'+row[c]+'\n'+'\n';
                            }

                        }


		            }
                }



            }




        };


        con.open("GET","/getusermessagebytoken/"+ email+ "/" + hash,true);
        con.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        con.send();


    return false;
};







function refreshwalltwo() //SHA256 hash working

{
                    var searchedemail = document.forms["searchinfobrowse"]["email"].value.toString();

                    var token = localStorage.getItem("data");


                    var email = localStorage.getItem("email");

                    var hash = SHA256(email + searchedemail +token)







                    var con;
                    con = new XMLHttpRequest();
                    con.onreadystatechange = function () {


                    if (con.readyState == 4 && con.status == 200)
                    {


                    var response = JSON.parse(con.responseText);


                        if(response.success==true)
                        {

                            document.getElementById("errorbrowsesearch").innerHTML="";
                            document.getElementById('walltwo').value="";

                            var data=response.data;
                            var row;
                            for(i =0;i<data.length;i++)
		                    {


                                row=data[i];
                                for(c=3;c>=0;c--)
                                {


                                if(c==3)
                                {
                                    document.getElementById('walltwo').value += 'To '+row[c];

                                }
                                if(c==2)
                                {
                                    document.getElementById('walltwo').value += ' from '+row[c];
                                }
                                if(c==1)
                                {
                                    document.getElementById('walltwo').value += ' message:'+ '\n'+row[c]+'\n'+'\n';
                                }

                                }


		                    }


                        }
                       else
	                    {
		                document.getElementById("errorbrowsesearch").innerHTML ="Did not find user with that email";
	                    }



                    }




                    };


                con.open("GET","/getusermessagebyemail/"+email+"/"+ searchedemail+"/"+hash,true);
                con.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                con.send();




return false;

};
















function postmessagetwo()//SHA 256 works
{
    var toemail = document.forms["searchinfobrowse"]["email"].value.toString();

    var token = localStorage.getItem("data");

    var message = document.forms["messagespostertwo"]["message"].value.toString();


    var email = localStorage.getItem("email");

    var hash = SHA256(email + toemail + message + token)

    var allinfo = "";
    allinfo += "email=" + email + "&";
    allinfo += "hash=" + hash + "&";
    allinfo += "toemail=" + toemail + "&";
    allinfo += "message=" + message;


                    var con;
                    con = new XMLHttpRequest();
                    con.onreadystatechange = function () {

                        if (con.readyState == 4 && con.status == 200) {

                            var response = JSON.parse(con.responseText);


                            if (response.success == true) {


                                refreshwalltwo();

                            }


                        }


                    };


                    con.open("POST", "/postmessage", true);
                    con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    con.send(allinfo);




    return false;
	
};







function browseemailsearch()//Funkar SHA 256 Hash works
{
	    var searchedemail = document.forms["searchinfobrowse"]["email"].value.toString();

	    var token= localStorage.getItem("data").toString();




        var email = localStorage.getItem("email")




        var hash = SHA256(email + searchedemail + token)



        var con;
        con = new XMLHttpRequest();
        con.onreadystatechange = function () {

            if (con.readyState == 4 && con.status == 200)
            {
            //success
                var response = JSON.parse(con.responseText);


                if(response.success==true)
                {
                    var info = response.data;

                    var searchedemail = info[0];

                    document.getElementById("firstnametwo").innerHTML = info[2];
		            document.getElementById("familynametwo").innerHTML = info[3];
		            document.getElementById("gendertwo").innerHTML = info[4];
		            document.getElementById("citytwo").innerHTML = info[5];
		            document.getElementById("countrytwo").innerHTML = info[6];
		            document.getElementById("emailtwo").innerHTML = info[0];



                    email = localStorage.getItem("email")

                    hash = SHA256(email + searchedemail +token)


                    var contwo;
                    contwo = new XMLHttpRequest();
                    contwo.onreadystatechange = function () {

                    if (contwo.readyState == 4 && contwo.status == 200)
                    {
                    //success

                    var response = JSON.parse(contwo.responseText);


                        if(response.success==true)
                        {

                            document.getElementById("errorbrowsesearch").innerHTML="";
                            document.getElementById('walltwo').value="";

                            var data=response.data;
                            var row;
                            for(i =0;i<data.length;i++)
		                    {


                                row=data[i];
                                for(c=3;c>=0;c--)
                                {


                                if(c==3)
                                {
                                    document.getElementById('walltwo').value += 'To '+row[c];

                                }
                                if(c==2)
                                {
                                    document.getElementById('walltwo').value += ' from '+row[c];
                                }
                                if(c==1)
                                {
                                    document.getElementById('walltwo').value += ' message:'+ '\n'+row[c]+'\n'+'\n';
                                }

                                }


		                    }





                        }
                       else
	                    {
		                document.getElementById("errorbrowsesearch").innerHTML ="Did not find user with that email";
	                    }



                    }




                    };


                contwo.open("GET","/getusermessagebyemail/"+email+"/"+ searchedemail+"/"+hash,true);
                contwo.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                contwo.send();











                }
                else
                {
                    document.getElementById("errorbrowsesearch").innerHTML ="Did not find user with that email";
                }



            }




        };


        con.open("GET","/getuserdatabyemail/"+ email +"/"+ searchedemail + "/" + hash,true);
        con.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        con.send();
    return false;


};



function refreshes(ev) {
    refreshwall()
}

















//FROM https://www.quora.com/How-do-I-generate-sha256-key-in-javascript
function SHA256(s){
 var chrsz  = 8;
 var hexcase = 0;
 function safe_add (x, y) {
 var lsw = (x & 0xFFFF) + (y & 0xFFFF);
 var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
 return (msw << 16) | (lsw & 0xFFFF);
 }
 function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
 function R (X, n) { return ( X >>> n ); }
 function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
 function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
 function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
 function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
 function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
 function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
 function core_sha256 (m, l) {
 var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
 var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
 var W = new Array(64);
 var a, b, c, d, e, f, g, h, i, j;
 var T1, T2;
 m[l >> 5] |= 0x80 << (24 - l % 32);
 m[((l + 64 >> 9) << 4) + 15] = l;
 for ( var i = 0; i<m.length; i+=16 ) {
 a = HASH[0];
 b = HASH[1];
 c = HASH[2];
 d = HASH[3];
 e = HASH[4];
 f = HASH[5];
 g = HASH[6];
 h = HASH[7];
 for ( var j = 0; j<64; j++) {
 if (j < 16) W[j] = m[j + i];
 else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
 T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
 T2 = safe_add(Sigma0256(a), Maj(a, b, c));
 h = g;
 g = f;
 f = e;
 e = safe_add(d, T1);
 d = c;
 c = b;
 b = a;
 a = safe_add(T1, T2);
 }
 HASH[0] = safe_add(a, HASH[0]);
 HASH[1] = safe_add(b, HASH[1]);
 HASH[2] = safe_add(c, HASH[2]);
 HASH[3] = safe_add(d, HASH[3]);
 HASH[4] = safe_add(e, HASH[4]);
 HASH[5] = safe_add(f, HASH[5]);
 HASH[6] = safe_add(g, HASH[6]);
 HASH[7] = safe_add(h, HASH[7]);
 }
 return HASH;
 }
 function str2binb (str) {
 var bin = Array();
 var mask = (1 << chrsz) - 1;
 for(var i = 0; i < str.length * chrsz; i += chrsz) {
 bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
 }
 return bin;
 }
 function Utf8Encode(string) {
 string = string.replace(/\r\n/g,"\n");
 var utftext = "";
 for (var n = 0; n < string.length; n++) {
 var c = string.charCodeAt(n);
 if (c < 128) {
 utftext += String.fromCharCode(c);
 }
 else if((c > 127) && (c < 2048)) {
 utftext += String.fromCharCode((c >> 6) | 192);
 utftext += String.fromCharCode((c & 63) | 128);
 }
 else {
 utftext += String.fromCharCode((c >> 12) | 224);
 utftext += String.fromCharCode(((c >> 6) & 63) | 128);
 utftext += String.fromCharCode((c & 63) | 128);
 }
 }
 return utftext;
 }
 function binb2hex (binarray) {
 var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
 var str = "";
 for(var i = 0; i < binarray.length * 4; i++) {
 str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
 hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
 }
 return str;
 }
 s = Utf8Encode(s);
 return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

