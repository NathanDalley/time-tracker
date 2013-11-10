from django.conf.urls import patterns, include, url


from models import TimeUnit

info_dict = {
    'queryset': TimeUnit.objects.all()
}

urlpatterns = patterns('',
    #url(r'^$', 'django.views.generic.list_detail.object_list', info_dict),

    # Examples:
    # url(r'^$', 'TimeTracker.views.home', name='home'),
    # url(r'^TimeTracker/', include('TimeTracker.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:

)
