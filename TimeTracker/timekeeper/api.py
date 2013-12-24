# myapp/api.py
from tastypie import fields, utils
from tastypie.resources import ModelResource, Resource
from tastypie.authorization import DjangoAuthorization
from tastypie.authentication import SessionAuthentication
from timekeeper.models import TimeUnit
from django.contrib.auth.models import User
from django.utils import timezone


import logging

from django.contrib.auth.decorators import login_required

from django.contrib.auth.models import User


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


class TimeUnitResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = TimeUnit.objects.all()
        resource_name = 'timeunit'
        allowed_methods = ['get', 'post', 'put']
        include_resource_uri = False
        authorization = DjangoAuthorization()
        #authentication = SessionAuthentication()
        always_return_data = True

    def determine_format(self, request):
        return 'application/json'

    def authorized_read_list(self, object_list, bundle):
        return object_list.filter(user=bundle.request.user.id)

    def hydrate_user(self, bundle):
        logging.error("UserID: %d" % bundle.request.user.id)
        bundle.data['user'] = "/api/v1/user/%d" % bundle.request.user.id
        return bundle


class MyStateResource(ModelResource):
    state = fields.BooleanField(default=False)

    class Meta:
        queryset = TimeUnit.objects.all()
        resource_name = 'mystate'
        allowed_methods = ['get', 'put']
        include_resource_uri = False
        authorization = DjangoAuthorization()
        #authentication = SessionAuthentication()
        always_return_data = True

    def get_object_list(self, request):
        data = super(MyStateResource, self).get_object_list(request).filter(user=request.user.id)

        #If they've completed this time unit, create and return a new empty one
        #if False and data.filter(pk=data.latest('checkedIn').id)[0].isComplete():
        #    new_timeunit = TimeUnit()
        #    new_timeunit.user = request.user
        #    new_timeunit.save()

        return data.filter(pk=data.latest('checkedIn').id)

    def determine_format(self, request):
        return 'application/json'

    def dehydrate_state(self, bundle):
        if bundle.obj.isCheckedIn() and not bundle.obj.isComplete():
            return True

        return False
'''
    def hydrate_checkedOut(self, bundle):
        logging.error(bundle.data['checkedOut'])
        bundle.data['checkedOut'] = timezone.now()

        return bundle
'''
'''
    def hydrate(self, bundle):
        logging.error("BOOYA")
        logging.error(bundle.data)
        super(MyStateResource, self).hydrate(bundle)
        #logging.error(bundle)
'''




'''
    def authorized_read_list(self, object_list, bundle):
        return object_list.filter(id=bundle.request.user.id)'''
