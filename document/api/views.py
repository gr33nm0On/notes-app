
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .permissions import IsOwner

from document.api.serializers import NoteSerializer, UserSerializer
from document.models import Note, Like


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action in ['create', 'like']:
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwner]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['get'])
    def like(self, request, *args, **kwargs):
        note = self.get_object()
        if Like.objects.filter(user=self.request.user, note=note).exists():
            Like.objects.get(user=request.user, note=note).delete()
        else:
            Like.objects.create(user=self.request.user, note=note)
        return Response({'pk': note.pk}, status=status.HTTP_204_NO_CONTENT)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwner]
        elif self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]