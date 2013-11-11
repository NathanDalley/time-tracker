from django.conf.urls import patterns, url
from django.views.generic import TemplateView

from accounts import views

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name="accounts/index.html")),
    url(r'^login/$', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/', 'django.contrib.auth.views.logout', {'next_page':'/time/'}, name='logout'),
    #url(r'^register/', 'django.contrib.auth.views.register', name='register'),
#    url(r'^login/$', views.loginView.as_view(), name='login'),
#    url(r'^logout/$', views.logoutView.as_view(), name='logout'),
)
