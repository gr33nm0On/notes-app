from django.contrib.auth.models import User
from rest_framework import viewsets

from document.api.serializers import NoteSerializer, UserSerializer
from document.models import Note


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer