from django.http import HttpResponse
from django.shortcuts import render


def home(request):
    response = HttpResponse()
    response = render(request, "timekeeper/index.html")

    if request.user.is_authenticated():
        response.set_cookie(key='username', value=request.user)
    else:
        response.set_cookie(key='username', value='none')

    return response