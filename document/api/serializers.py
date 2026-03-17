from rest_framework import serializers
from django.contrib.auth.models import User

from document.models import Note, NoteFile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class NoteFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteFile
        fields = "__all__"


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"