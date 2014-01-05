from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.conf import settings
from timekeeper import views

from models import TimeUnit

info_dict = {
    'queryset': TimeUnit.objects.all()
}

urlpatterns = patterns('',
    #url(r'^$', TemplateView.as_view(template_name="timekeeper/index.html")),
    url(r'^$', views.home),
    url(r'^app/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.STATIC_NG_URL}),

    #url(r'^$', 'django.partials.generic.list_detail.object_list', info_dict),

    # Examples:
    # url(r'^$', 'TimeTracker.partials.home', name='home'),
    # url(r'^TimeTracker/', include('TimeTracker.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:

)
