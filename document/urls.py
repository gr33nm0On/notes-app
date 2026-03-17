from django.urls import path

from document.views import NoteCreateView, NoteListView

urlpatterns = [
    path('create', NoteCreateView.as_view()),
    path('', NoteListView.as_view()),
]
