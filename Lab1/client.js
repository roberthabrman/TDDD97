window.onload = function(){


	if(localStorage.getItem("data")=="" || localStorage.getItem("data")==null)
	{
		document.getElementById("currentview").innerHTML = document.getElementById("welcomeview").innerHTML;

	}
	else 
	{
		document.getElementById("currentview").innerHTML = document.getElementById("profileview").innerHTML;
		document.getElementById("defaultOpen").click();//vill öppna home direkt
		

		refreshwall();		
	}
};



function validateformone()
{

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

		var p= serverstub.signIn(email.toString(),password.toString());


		if(p.success==true)
		{
			
			localStorage.setItem("data", p.data);
			return true;
			
		}
		else
		{
			
			document.getElementById("loginmessage").innerHTML = "Wrong email or password";
		
			return false;
			


		}


	}
	

};




function validateformtwo()
{
	var firstname = document.forms["formtwo"]["firstname"].value;
	var familyname = document.forms["formtwo"]["familyname"].value;

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

		var info =
		{
			firstname:firstname.toString(),
			familyname:familyname.toString(),
			gender:"male",
			city:city.toString(),
			country:country.toString(),
			email:email.toString(),
		password:password.toString()};//skapar en array med alla värden från formen

		var p= serverstub.signUp(info);
		
		

		
		document.getElementById("loginmessage").innerHTML = "user created"

	}



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















function changepass()
{
	var oldpassword = document.forms["passwordchange"]["oldpassword"].value;
	var newpassword = document.forms["passwordchange"]["newpassword"].value;
	if(newpassword.length<=6)
	{
		document.getElementById("changepassinfo").innerHTML ="The new password has to be longer";

	}
	else
	{
		var p = serverstub.changePassword(localStorage.getItem("data").toString(),oldpassword.toString(),newpassword.toString());


		if(p.success)
		{
		document.getElementById("changepassinfo").innerHTML = p.message.toString();//går inte 
		
	}
	else
	{
		document.getElementById("changepassinfo").innerHTML = p.message.toString();
		
	}

}
};

function signout()
{
	var p = serverstub.signOut(localStorage.getItem("data").toString());

	localStorage.setItem("data", "");
	window.onload();
};







function updatecontent()
{
	var temp = serverstub.getUserDataByToken(localStorage.getItem("data"));

	var info = temp.data;


	if(temp.success)
	{
		document.getElementById("firstname").innerHTML = info.firstname.toString();
		document.getElementById("familyname").innerHTML = info.familyname.toString();
		document.getElementById("gender").innerHTML = info.gender.toString();
		document.getElementById("city").innerHTML = info.city.toString();
		document.getElementById("country").innerHTML = info.country.toString();
		document.getElementById("email").innerHTML = info.email.toString();
	}


};







function postmessage()
{

	
	var temp = serverstub.getUserDataByToken(localStorage.getItem("data"));

	var info = temp.data;


	var a = serverstub.postMessage(localStorage.getItem("data"),document.forms["messagesposter"]["message"].value.toString(),info.email.toString());


	var o = serverstub.getUserMessagesByToken(localStorage.getItem("data"));

	if(o.success == true)
	{


		refreshwall();

	}
	


};




function refreshwall()
{
	
	var o = serverstub.getUserMessagesByToken(localStorage.getItem("data"));

	document.getElementById('wall').value="";//tar bort tidigare, fyller helt ny

	if(o.success)
	{




		for(i =0;i<o.data.length;i++)
		{
			document.getElementById('wall').value += o.data[i].writer.toString();
			document.getElementById('wall').value += ':\n';
			document.getElementById('wall').value += o.data[i].content.toString();
			document.getElementById('wall').value += '\n';
			document.getElementById('wall').value += '\n';

			
		}
	}


};

function refreshwalltwo()
{
	
	var o = serverstub.getUserMessagesByToken(localStorage.getItem("data"));

	document.getElementById('wall').value="";//tar bort tidigare, fyller helt ny

	if(o.success)
	{

		for(i =0;i<o.data.length;i++)
		{
			document.getElementById('wall').value += o.data[i].writer.toString();
			document.getElementById('wall').value += ':\n';
			document.getElementById('wall').value += o.data[i].content.toString();
			document.getElementById('wall').value += '\n';
			document.getElementById('wall').value += '\n';

			
		}
	}


};
function postmessagetwo()
{


	var email = document.forms["searchinfobrowse"]["email"].value.toString();
	

	var a = serverstub.postMessage(localStorage.getItem("data"),document.forms["messagespostertwo"]["message"].value.toString(),email.toString());


	var ro = serverstub.getUserMessagesByEmail(localStorage.getItem("data"),email.toString());


	if(ro.success)
	{	

		document.getElementById('walltwo').value="";

		
		
		for(i =0;i<ro.data.length;i++)
		{
			document.getElementById('walltwo').value += ro.data[i].writer.toString();
			document.getElementById('walltwo').value += ':\n';
			document.getElementById('walltwo').value += ro.data[i].content.toString();
			document.getElementById('walltwo').value += '\n';
			document.getElementById('walltwo').value += '\n';

		}
	}
	
};







function browseemailsearch()
{
	var searchedemail = document.forms["searchinfobrowse"]["email"].value.toString();

	


	var temp =serverstub.getUserDataByEmail(localStorage.getItem("data"),searchedemail.toString());




	if(temp.success)
	{
		var info = temp.data;
		document.getElementById("firstnametwo").innerHTML = info.firstname.toString();
		document.getElementById("familynametwo").innerHTML = info.familyname.toString();
		document.getElementById("gendertwo").innerHTML = info.gender.toString();
		document.getElementById("citytwo").innerHTML = info.city.toString();
		document.getElementById("countrytwo").innerHTML = info.country.toString();
		document.getElementById("emailtwo").innerHTML = info.email.toString();


		var ro = serverstub.getUserMessagesByEmail(localStorage.getItem("data"),searchedemail.toString());


		if(ro.success)
		{	
			document.getElementById("errorbrowsesearch").innerHTML="";
			document.getElementById('walltwo').value="";

			
			
			for(i =0;i<ro.data.length;i++)
			{
				document.getElementById('walltwo').value += ro.data[i].writer.toString();
				document.getElementById('walltwo').value += ':\n';
				document.getElementById('walltwo').value += ro.data[i].content.toString();
				document.getElementById('walltwo').value += '\n';
				document.getElementById('walltwo').value += '\n';

			}
		}


	}

	else
	{
		document.getElementById("errorbrowsesearch").innerHTML ="Did not find user with that email";
	}





};


