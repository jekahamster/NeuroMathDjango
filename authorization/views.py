from django.shortcuts import render

def startPage(response):
	return render(response, "authorization/authorization.html")