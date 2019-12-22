from django.urls import path
from . import views, requests

urlpatterns = [
	path('', views.index),
	path('recognize/', requests.recognize),
	path('adjust/', requests.adjust)
]