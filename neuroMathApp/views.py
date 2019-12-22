from django.shortcuts import render

def index(responce):
	return render(responce, "neuroMathApp/index.html")