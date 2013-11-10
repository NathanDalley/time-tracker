from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()


from tastypie.api import Api
from timekeeper.api import TimeUnitResource, UserResource
v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(TimeUnitResource())


urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name="index.html")),
    url(r'^time/', include('timekeeper.urls'), "format: json"),
    url(r'^api/', include(v1_api.urls)),

    # Examples:
    # url(r'^$', 'TimeTracker.views.home', name='home'),
    # url(r'^TimeTracker/', include('TimeTracker.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
