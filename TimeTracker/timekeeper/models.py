# Create your models here.
from django.db import models
from django.contrib.auth.models import User

from django.utils import timezone


class TimeUnit(models.Model):
    user = models.ForeignKey(User)
    checkedIn = models.DateTimeField()
    checkedOut = models.DateTimeField(blank=True, null=True)

    def isComplete(self):
        return self.checkedOut is not None

    def isCheckedIn(self):
        return self.checkedIn is not None

    def checkIn(self):
        if not self.isCheckedIn() and not self.isComplete():
            self.checkedIn = timezone.now()

    def checkOut(self):
        if self.checkedIn and not self.isComplete():
            self.checkedOut = timezone.now()

    def duration(self):
        if self.isComplete():
            return self.checkedOut - self.checkedIn
        else:
            return 0

    def __unicode__(self):
        if self.isComplete():
            return "time: " + self.duration().__str__()

        if self.isCheckedIn():
            return "At Work"

        return "wut?"

    def __init__(self, *args, **kwargs):
        super(TimeUnit, self).__init__(*args, **kwargs)
        self.checkIn()
