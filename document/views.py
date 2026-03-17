from django.shortcuts import render
from django.views import View


class NoteCreateView(View):
    def get(self, request):
        return render(request, 'document/note-create.html')

class NoteListView(View):
    def get(self, request):
        return render(request, 'document/note-list.html')