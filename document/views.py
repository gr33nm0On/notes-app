from django.shortcuts import render
from django.views import View


class NoteView(View):
    def get(self, request):
        return render(request, 'document/note.html')