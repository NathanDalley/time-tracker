# myapp/api.py
from tastypie import fields, utils
from tastypie.resources import ModelResource, Resource
from timekeeper.models import TimeUnit
from django.contrib.auth.models import User


import logging

from django.contrib.auth.decorators import login_required

from django.contrib.auth.models import User


class TimeUnitResource(ModelResource):

    class Meta:
        queryset = TimeUnit.objects.all()
        resource_name = 'timeunit'

    def determine_format(self, request):
        return 'application/json'

    def authorized_read_list(self, object_list, bundle):
        return object_list.filter(user=bundle.request.user.id)


class MyStateResource(ModelResource):
    state = fields.BooleanField(default=False)

    class Meta:
        queryset = TimeUnit.objects.all()
        resource_name = 'mystate'
        allowed_methods = ['get', 'put']
        include_resource_uri = False

    def get_object_list(self, request):
        data = super(MyStateResource, self).get_object_list(request).filter(user=request.user.id)
        return data.filter(pk=data.latest('checkedIn').id)

    def determine_format(self, request):
        return 'application/json'

    def dehydrate_state(self, bundle):
        if bundle.obj.isCheckedIn() and not bundle.obj.isComplete():
            return True

        return False

    def hydrate(self, bundle):
        logging.error("BOOYA")
        super(MyStateResource, self).hydrate(bundle)
    #def obj_create(self, bundle, **kwargs):
     #   logging.error("Obj Creating method!!")

    '''def dehydrate(self, bundle):
        return bundle'''

    '''def authorized_read_list(self, object_list, bundle):
        return object_list.filter(id=bundle.request.user.id)'''


class UserResource(ModelResource):

    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = ['email', 'password', 'is_active', 'is_staff', 'is_superuser']
        allowed_methods = ['get']

    def authorized_read_list(self, object_list, bundle):
        return object_list.filter(id=bundle.request.user.id)

    def determine_format(self, request):
        logging.error("Stuff")
        return 'application/json'