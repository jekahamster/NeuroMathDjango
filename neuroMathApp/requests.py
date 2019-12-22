import threading
from settings_controller import SettingsController
SettingsController.loadFrom(SettingsController.DEFAULT_PATH)

from recognizer import Recognizer
from calculator import Calculator
if (SettingsController.finderMode == 0):
    from symbol_finder import SymbolFinder
elif (SettingsController.finderMode == 1):
    from recursive_symbol_finder import SymbolFinder
elif (SettingsController.finderMode == 2):
    from sector_symbol_finder import SymbolFinder

from django.http import HttpResponse 
from django.http import JsonResponse

def recognize(response):
	recognizer = Recognizer()

	PATH = response.GET["canvasURL"]
	imgList = SymbolFinder.find(PATH)
	outputList = recognizer.recognize(imgList)
	outputStr = "".join(outputList)
	
	try:
		ans, mode = Calculator.calc(outputStr)
		if mode == Calculator.DEFAULT:
			pass
		elif mode == Calculator.EQUALITY:
			outputStr += " = "+str(ans)
		elif mode == Calculator.INEQUALITY:
			outputStr += " is "+str(ans)
	except SyntaxError:
		pass
	except ZeroDivisionError:
		pass
	except TypeError:
		pass

	return HttpResponse(outputStr)

def adjust(response):
	recognizer = Recognizer()

	PATH = response.GET["canvasURL"]
	text = response.GET["text"]

	imgList = SymbolFinder.find(PATH)

	text = list(text)
	print(text)
	recognizer.adjust(imgList, text)
	return HttpResponse("Adjusting was successful")