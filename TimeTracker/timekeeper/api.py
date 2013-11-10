# myapp/api.py
from tastypie.resources import ModelResource
from timekeeper.models import TimeUnit

from django.contrib.auth.models import User


class TimeUnitResource(ModelResource):

    class Meta:
        queryset = TimeUnit.objects.all()
        resource_name = 'timeunit'

    def determine_format(self, request):
        return 'application/json'


class UserResource(ModelResource):

    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = ['email', 'password', 'is_active', 'is_staff', 'is_superuser']
        allowed_methods = ['get']

    def determine_format(self, request):
        return 'application/json'