from django.urls import path

from document.views import NoteCreateView, NoteListView, RegisterView, LoginView, LogoutView

urlpatterns = [
    path('create/', NoteCreateView.as_view(), name='create-view'),
    path('', NoteListView.as_view(), name='list-view'),
    path('register/', RegisterView.as_view(), name='register-view'),
    path('login/', LoginView.as_view(), name='login-view'),
    path('logout/', LogoutView.as_view(), name='logout-view'),
]
