from django.urls import path

from document.views import NoteView

urlpatterns = [
    path('', NoteView.as_view()),
]
